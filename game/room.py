class Room:

    def __init__(self, name, expected_players_number):
        self.name = name
        self.expected_players_number = expected_players_number
        self.current_players = []
        self.is_full = False
        self.is_started = False

    def add_player(self, player):
        self.current_players.append(player)

    def remove_player(self, player):
        self.current_players.remove(player)

    def get_players_number(self):
        return len(self.current_players)

