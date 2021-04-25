var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import GameActions from 'GameActions.js';
import PlayersInfo from 'PlayersInfo.js';
import Gameboard from 'Gameboard.js';
import ActionLog from 'ActionLog.js';

var NAMES = ["Quniton", "Geneva", "Trevor", "Simon", "Vladimir", "Yvonne", "Kristoph", "Ernest", "Irma", "Marion", "Ophelia", "Neil", "Barrin", "Wilhelm", "Phoebe", "Zachary", "Horatio", "Deidre", "Alyss", "Clive", "Udstad", "Ryan", "Julian", "Franklin", "Linus"];

var GamePage = function (_React$Component) {
  _inherits(GamePage, _React$Component);

  function GamePage(props) {
    _classCallCheck(this, GamePage);

    var _this = _possibleConstructorReturn(this, (GamePage.__proto__ || Object.getPrototypeOf(GamePage)).call(this, props));

    _this.changeActionMod = _this.changeActionMod.bind(_this);
    _this.startGame = _this.startGame.bind(_this);
    _this.state = {
      yourName: "default",
      actionMod: "shift",
      webSocket: null,
      log: [],
      players: ["default"],
      gameInfo: {
        board: NAMES.map(function (e) {
          return { name: e, status: 1 };
        }),
        current_player_role: "1",
        scores: { default: "0" },
        game_current_player: "default",
        turn_counter: "0",
        previous_move: "default;0;0",
        message: "",
        winner: "default"
      }
    };
    return _this;
  }

  _createClass(GamePage, [{
    key: 'startGame',
    value: function startGame() {
      if (this.state.webSocket != null) {
        this.state.webSocket.send(JSON.stringify({
          message_type: "start_game_message",
          message: "Game starts!"
        }));
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var roomName = window.location.href.split("/").slice(-1)[0];
      var gameSocket = new WebSocket("ws://" + window.location.host + "/ws/game/" + roomName + "/");

      gameSocket.onmessage = function (e) {
        var data = JSON.parse(e.data);
        if (data.message_type == "game_info_message") {
          _this2.setState({
            gameInfo: data,
            actionMod: "shift"
          });
          if (data.message.includes("moves")) {
            var sound = new Audio("/static/sounds/move.mp3");
            sound.play();
          }
          if (data.message.includes("catches")) {
            var _sound = new Audio("/static/sounds/catch.mp3");
            _sound.play();
          }
          if (data.message.includes("interrogates")) {
            var _sound2 = new Audio("/static/sounds/interrogate.mp3");
            _sound2.play();
          }
          _this2.state.log.unshift(data.message);
          _this2.setState({
            log: _this2.state.log
          });
        }
        if (data.message_type == "new_player_message") {
          _this2.setState({
            players: data.players,
            yourName: data.current_player
          });
        }
        if (data.message_type == "player_left_message") {
          _this2.setState({
            players: data.players
          });
        }
        if (data.message_type == "game_is_ready_message" && _this2.state.yourName == _this2.state.players[0]) {
          _this2.startGame();
        }
        console.log(data);
      };
      gameSocket.onclose = function (e) {
        console.error("Chat socket closed unexpectedly");
      };
      this.setState({
        webSocket: gameSocket
      });
    }
  }, {
    key: 'changeActionMod',
    value: function changeActionMod(newMode) {
      if (this.state.actionMod === newMode) this.setState({
        actionMod: "shift"
      });else this.setState({
        actionMod: newMode
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'main',
          null,
          React.createElement(
            'div',
            { className: 'container-fluid' },
            React.createElement(
              'div',
              { className: 'row' },
              React.createElement(
                'div',
                { className: 'col-md-2' },
                React.createElement(
                  'div',
                  { className: 'row' },
                  React.createElement(GameActions, {
                    changeActionModFunc: this.changeActionMod,
                    actionMod: this.state.actionMod
                  })
                ),
                React.createElement(
                  'div',
                  { className: 'row' },
                  React.createElement(PlayersInfo, {
                    players: this.state.players,
                    scores: this.state.gameInfo.scores,
                    currentPlayer: this.state.gameInfo.game_current_player,
                    turn: this.state.gameInfo.turn_counter
                  })
                ),
                React.createElement(
                  'div',
                  { className: 'row' },
                  React.createElement(ActionLog, { log: this.state.log })
                )
              ),
              React.createElement(
                'div',
                { className: 'col-md-10' },
                React.createElement(Gameboard, {
                  actionMod: this.state.actionMod,
                  currentPlayerRole: this.state.gameInfo.current_player_role,
                  board: this.state.gameInfo.board,
                  webSocket: this.state.webSocket,
                  active: this.state.yourName == this.state.gameInfo.game_current_player && this.state.gameInfo.winner == null,
                  previousMove: this.state.gameInfo.previous_move
                })
              )
            )
          )
        )
      );
    }
  }]);

  return GamePage;
}(React.Component);

ReactDOM.render(React.createElement(GamePage, null), document.getElementById("root"));