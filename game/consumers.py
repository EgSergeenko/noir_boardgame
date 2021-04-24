import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.cache import cache

from game.game import Game


class GameConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'game_{self.room_name}'

        current_rooms = cache.get('rooms')
        if self.room_name in current_rooms.keys():
            current_room = current_rooms[self.room_name]
        else:
            self.close()
            return
        username = self.scope['user'].username

        if self.scope['user'].is_anonymous or username in current_room.current_players:
            self.close()
            return

        current_room.add_player(username)
        players = current_room.current_players

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'new_player_message',
                'players': players
            }
        )

        if current_room.is_started:
            async_to_sync(self.channel_layer.send)(
                self.channel_name,
                {
                    'type': 'game_info_message',
                    'message': 'You successfully reconnected!',
                }
            )

        elif current_room.get_players_number() == current_room.expected_players_number:
            current_room.is_full = True
            self.game_is_ready()

        current_rooms[self.room_name] = current_room
        cache.set('rooms', current_rooms, None)

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
        current_rooms = cache.get('rooms')
        current_room = current_rooms[self.room_name]
        username = self.scope['user'].username
        if username in current_room.current_players:
            current_room.remove_player(username)
        if current_room.is_full and not current_room.is_started:
            current_room.is_full = False
            self.game_is_not_ready()
        current_rooms[self.room_name] = current_room
        cache.set('rooms', current_rooms, None)

        players = current_room.current_players

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'player_left_message',
                'players': players
            }
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)

        if text_data_json['message_type'] == 'start_game_message':
            message = text_data_json['message']

            current_rooms = cache.get('rooms')
            current_room = current_rooms[self.room_name]
            current_room.is_started = True
            players = current_room.current_players
            current_rooms[self.room_name] = current_room
            cache.set('rooms', current_rooms, None)

            game = Game(self.room_name, players)

            current_games = cache.get_or_set('games', {}, None)
            current_games[self.room_name] = game
            cache.set('games', current_games, None)

            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'game_info_message',
                    'message': message,
                }
            )
        elif text_data_json['message_type'] == 'turn_message':
            message = text_data_json['message']
            games = cache.get('games')
            game = games[self.room_name]

            if game.current_player == self.scope['user'].username:
                action, x, y = message.split(';')
                if action == 'move':
                    direction = x
                    idx = int(y)
                    message = game.move(direction, idx)
                elif action == 'catch':
                    row = int(x)
                    column = int(y)
                    message = game.catch(row, column)
                else:
                    row = int(x)
                    column = int(y)
                    message = game.interrogate(row, column)

                games[self.room_name] = game
                cache.set('games', games, None)

                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    {
                        'type': 'game_info_message',
                        'message': message,
                    }
                )

    def new_player_message(self, event):
        players = event['players']
        message_type = event['type']

        self.send(text_data=json.dumps(
            {
                'message_type': message_type,
                'players': players,
                'current_player': self.scope['user'].username
            }
        ))

    def game_is_ready(self):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'game_is_ready_message',
                'message': 'ready'
            }
        )

    def game_is_ready_message(self, event):
        message = event['message']
        message_type = event['type']

        self.send(text_data=json.dumps(
            {
                'message_type': message_type,
                'message': message
            }
        ))

    def game_is_not_ready(self):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'game_is_not_ready_message',
                'message': 'not ready'
            }
        )

    def game_is_not_ready_message(self, event):
        message = event['message']
        message_type = event['type']

        self.send(text_data=json.dumps(
            {
                'message_type': message_type,
                'message': message
            }
        ))

    def game_info_message(self, event):
        game = cache.get('games')[self.room_name]
        message_type = event['type']
        message = event['message']
        flat_board = [item for sublist in game.board for item in sublist]
        current_player_role = game.players_roles[self.scope['user'].username]

        self.send(text_data=json.dumps(
            {
                'message_type': message_type,
                'board': flat_board,
                'scores': game.players_scores,
                'current_player_role': current_player_role,
                'game_current_player': game.current_player,
                'previous_move': game.previous_move,
                'winner': game.winner,
                'message': message,
                'turn_counter': game.turn_counter
            }
        ))
        if game.winner is not None:
            games = cache.get('games')
            games.pop(game.name)
            cache.set('games', games, None)

            rooms = cache.get('rooms')
            rooms.pop(self.room_name)
            cache.set('rooms', rooms, None)

    def player_left_message(self, event):
        message_type = event['type']
        players = event['players']

        self.send(text_data=json.dumps(
            {
                'message_type': message_type,
                'players': players,
            }
        ))
