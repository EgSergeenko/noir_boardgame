import random
from itertools import cycle


def increment_turn_counter(turn_func):
    def wrapper(*args):
        args[0].turn_counter += 1
        return turn_func(*args)

    return wrapper


NAMES = [
    'Quniton',
    'Geneva',
    'Trevor',
    'Simon',
    'Vladimir',
    'Yvonne',
    'Kristoph',
    'Ernest',
    'Irma',
    'Marion',
    'Ophelia',
    'Neil',
    'Barrin',
    'Wilhelm',
    'Phoebe',
    'Zachary',
    'Horatio',
    'Deidre',
    'Alyss',
    'Clive',
    'Udstad',
    'Ryan',
    'Julian',
    'Franklin',
    'Linus'
]


class Game:

    def __init__(self, name, players):
        self.name = name
        random.shuffle(players)
        self.players = players
        self.players_order = cycle(players)
        self.current_player = next(self.players_order)
        deck = NAMES.copy()
        random.shuffle(deck)
        self.deck = deck.copy()
        random.shuffle(deck)
        self.board = self.__set_up_board(deck)
        self.players_roles = self.__assign_roles(players)
        self.players_scores = self.__set_up_scores(players)
        self.turn_counter = 1
        self.previous_move = 'default;0;0'
        self.winner = None

    @increment_turn_counter
    def interrogate(self, row, column):
        witness, cards = self.__get_adjacent(row, column)
        players = []
        for card in cards:
            if card['name'] in self.players_roles.values():
                for player, role in self.players_roles.items():
                    if card['name'] == role:
                        players.append(player)

        message = f'{self.current_player} interrogates {witness["name"]}.' \
                  f' {"He/she saw nothing" if len(players) == 0 else "Players nearby: " + ", ".join(players)}.'
        self.current_player = next(self.players_order)
        self.previous_move = None
        return message

    @increment_turn_counter
    def catch(self, row, column):
        card = self.board[row][column]['name']
        for player, role in self.players_roles.items():
            if card == role:
                self.players_scores[self.current_player] += 1
                self.board[row][column]['status'] = 0
                message = f'{self.current_player} catches {player} ({card})!'
                is_over, winner = self.__is_over()
                if is_over:
                    self.winner = winner
                    message = f'{self.current_player} catches {player} ({card})! {self.winner} wins!'
                    return message
                self.__assign_new_role(player)
                self.current_player = next(self.players_order)
                self.previous_move = None
                return message
        message = f'{self.current_player} catches {card}, but he/she is innocent!'
        self.current_player = next(self.players_order)
        self.previous_move = None
        return message

    @increment_turn_counter
    def move(self, direction, idx):
        if direction == 'left':
            self.board[idx] = self.board[idx][1:] + [self.board[idx][0]]
        elif direction == 'right':
            self.board[idx] = [self.board[idx][-1]] + self.board[idx][:-1]
        elif direction == 'up':
            tmp = self.board[0][idx]
            for i in range(1, len(self.board)):
                self.board[i - 1][idx] = self.board[i][idx]
            self.board[-1][idx] = tmp
        else:
            tmp = self.board[-1][idx]
            for i in range(len(self.board) - 2, -1, -1):
                self.board[i + 1][idx] = self.board[i][idx]
            self.board[0][idx] = tmp
        if direction == 'up' or direction == 'down':
            message = f'{self.current_player} moves the {idx + 1} column {direction}.'
        else:
            message = f'{self.current_player} moves the {idx + 1} row {direction}.'
        self.previous_move = f'{direction};{idx}'
        self.current_player = next(self.players_order)
        return message

    def __assign_roles(self, players):
        players_roles = {}
        for i in range(len(players)):
            players_roles[players[i]] = self.deck.pop(0)
        return players_roles

    def __is_over(self):
        for player, score in self.players_scores.items():
            if score == 3:
                return True, player
        return False, None

    def __set_up_scores(self, players):
        players_scores = {}
        for i in range(len(players)):
            players_scores[players[i]] = 0
        return players_scores

    def __assign_new_role(self, player):
        self.players_roles[player] = self.deck.pop(0)

    def __set_up_board(self, deck):
        board = []
        card_idx = 0
        for i in range(5):
            row = []
            for j in range(5):
                row.append({'name': deck[card_idx], 'status': 1})
                card_idx += 1
            board.append(row)
        return board

    def __get_adjacent(self, row, column):
        cards = []
        for i in range(max(row - 1, 0), min(len(self.board) - 1, row + 1) + 1):
            for j in range(max(column - 1, 0), min(len(self.board[0]) - 1, column + 1) + 1):
                cards.append(self.board[i][j])
        return self.board[row][column], cards
