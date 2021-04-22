from django.test import TestCase
from game.room import Room
from game.game import Game


class RoomTestCase(TestCase):

    def test_adding_player(self):
        room = Room('room_1', 3)
        room.add_player('egor')
        self.assertIn('egor', room.current_players)

    def test_removing_player(self):
        room = Room('room_1', 3)
        room.add_player('egor')
        room.remove_player('egor')
        self.assertNotIn('egor', room.current_players)


class GameTestCase(TestCase):

    def test_moving(self):
        game = Game('room_1', ['player_1', 'player_2', 'player_3'])
        current_player = game.current_player
        message = game.move('up', 0)
        self.assertEqual(message, f'{current_player} moves the 1 column up.')
        current_player = game.current_player
        message = game.move('left', 3)
        self.assertEqual(message, f'{current_player} moves the 4 row left.')

    def test_turn_passing(self):
        game = Game('room_1', ['player_1', 'player_2', 'player_3'])
        previous_player = game.current_player
        for i in range(len(game.players)):
            message = game.move('up', 0)
            current_player = game.current_player
            self.assertNotEqual(current_player, previous_player)
            previous_player = current_player
