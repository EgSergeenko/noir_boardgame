var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NAMES = ['Quniton', 'Geneva', 'Trevor', 'Simon', 'Vladimir', 'Yvonne', 'Kristoph', 'Ernest', 'Irma', 'Marion', 'Ophelia', 'Neil', 'Barrin', 'Wilhelm', 'Phoebe', 'Zachary', 'Horatio', 'Deidre', 'Alyss', 'Clive', 'Udstad', 'Ryan', 'Julian', 'Franklin', 'Linus'];

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
          message: "start"
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
            gameInfo: data
          });
          _this2.state.log.push(data.message);
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
                  React.createElement(GameActions, { changeActionModFunc: this.changeActionMod })
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

var GameActions = function (_React$Component2) {
  _inherits(GameActions, _React$Component2);

  function GameActions(props) {
    _classCallCheck(this, GameActions);

    return _possibleConstructorReturn(this, (GameActions.__proto__ || Object.getPrototypeOf(GameActions)).call(this, props));
  }

  _createClass(GameActions, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'info-block' },
        React.createElement(GameActionButton, {
          content: 'Interrogate',
          actionMod: 'interrogate',
          changeActionModFunc: this.props.changeActionModFunc
        }),
        React.createElement(GameActionButton, {
          content: 'Catch',
          actionMod: 'catch',
          changeActionModFunc: this.props.changeActionModFunc
        })
      );
    }
  }]);

  return GameActions;
}(React.Component);

var GameActionButton = function (_React$Component3) {
  _inherits(GameActionButton, _React$Component3);

  function GameActionButton(props) {
    _classCallCheck(this, GameActionButton);

    var _this4 = _possibleConstructorReturn(this, (GameActionButton.__proto__ || Object.getPrototypeOf(GameActionButton)).call(this, props));

    _this4.changeActionMod = _this4.changeActionMod.bind(_this4);
    return _this4;
  }

  _createClass(GameActionButton, [{
    key: 'changeActionMod',
    value: function changeActionMod() {
      this.props.changeActionModFunc(this.props.actionMod);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'action-button', onClick: this.changeActionMod },
        this.props.content
      );
    }
  }]);

  return GameActionButton;
}(React.Component);

var PlayersInfo = function (_React$Component4) {
  _inherits(PlayersInfo, _React$Component4);

  function PlayersInfo(props) {
    _classCallCheck(this, PlayersInfo);

    return _possibleConstructorReturn(this, (PlayersInfo.__proto__ || Object.getPrototypeOf(PlayersInfo)).call(this, props));
  }

  _createClass(PlayersInfo, [{
    key: 'render',
    value: function render() {
      var _this6 = this;

      var scores = new Map(Object.entries(this.props.scores));
      return React.createElement(
        'div',
        { className: 'info-block' },
        this.props.players.map(function (nickname, i) {
          if (_this6.props.currentPlayer == nickname) return React.createElement(PlayerBadge, {
            key: i,
            nickname: nickname,
            score: !!scores.get(nickname) ? scores.get(nickname) : 0,
            current: true
          });
          return React.createElement(PlayerBadge, {
            key: i,
            nickname: nickname,
            score: !!scores.get(nickname) ? scores.get(nickname) : 0
          });
        }),
        React.createElement(Turn, { turn: this.props.turn })
      );
    }
  }]);

  return PlayersInfo;
}(React.Component);

var PlayerBadge = function (_React$Component5) {
  _inherits(PlayerBadge, _React$Component5);

  function PlayerBadge(props) {
    _classCallCheck(this, PlayerBadge);

    return _possibleConstructorReturn(this, (PlayerBadge.__proto__ || Object.getPrototypeOf(PlayerBadge)).call(this, props));
  }

  _createClass(PlayerBadge, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        {
          className: "player-badge" + (this.props.current ? " current-player" : " ")
        },
        this.props.nickname,
        React.createElement('br', null),
        "Score: " + this.props.score
      );
    }
  }]);

  return PlayerBadge;
}(React.Component);

var Turn = function (_React$Component6) {
  _inherits(Turn, _React$Component6);

  function Turn(props) {
    _classCallCheck(this, Turn);

    return _possibleConstructorReturn(this, (Turn.__proto__ || Object.getPrototypeOf(Turn)).call(this, props));
  }

  _createClass(Turn, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'turn' },
        React.createElement(
          'b',
          null,
          "Turn: " + this.props.turn
        )
      );
    }
  }]);

  return Turn;
}(React.Component);

var ActionLog = function (_React$Component7) {
  _inherits(ActionLog, _React$Component7);

  function ActionLog(props) {
    _classCallCheck(this, ActionLog);

    return _possibleConstructorReturn(this, (ActionLog.__proto__ || Object.getPrototypeOf(ActionLog)).call(this, props));
  }

  _createClass(ActionLog, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'info-block action-log' },
        this.props.log.map(function (l, i) {
          return React.createElement(
            'div',
            { key: i },
            l,
            React.createElement('br', null)
          );
        })
      );
    }
  }]);

  return ActionLog;
}(React.Component);

var Gameboard = function (_React$Component8) {
  _inherits(Gameboard, _React$Component8);

  function Gameboard(props) {
    _classCallCheck(this, Gameboard);

    return _possibleConstructorReturn(this, (Gameboard.__proto__ || Object.getPrototypeOf(Gameboard)).call(this, props));
  }

  _createClass(Gameboard, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'container-fluid' },
        React.createElement(VerticalArrows, {
          direction: 'up',
          onClickFunc: this.handleArrowClick,
          webSocket: this.props.webSocket,
          active: this.props.active,
          previousMove: this.props.previousMove
        }),
        React.createElement(
          'div',
          { className: 'flex-block' },
          React.createElement(HorizontalArrows, {
            direction: 'left',
            onClickFunc: this.handleArrowClick,
            webSocket: this.props.webSocket,
            active: this.props.active,
            previousMove: this.props.previousMove
          }),
          React.createElement(NoirCards, {
            board: this.props.board,
            actionMod: this.props.actionMod,
            currentPlayerRole: this.props.currentPlayerRole,
            webSocket: this.props.webSocket,
            active: this.props.active,
            previousMove: this.props.previousMove
          }),
          React.createElement(HorizontalArrows, {
            direction: 'right',
            onClickFunc: this.handleArrowClick,
            webSocket: this.props.webSocket,
            active: this.props.active,
            previousMove: this.props.previousMove
          })
        ),
        React.createElement(VerticalArrows, {
          direction: 'down',
          onClickFunc: this.handleArrowClick,
          webSocket: this.props.webSocket,
          active: this.props.active,
          previousMove: this.props.previousMove
        })
      );
    }
  }]);

  return Gameboard;
}(React.Component);

var HorizontalArrows = function (_React$Component9) {
  _inherits(HorizontalArrows, _React$Component9);

  function HorizontalArrows(props) {
    _classCallCheck(this, HorizontalArrows);

    return _possibleConstructorReturn(this, (HorizontalArrows.__proto__ || Object.getPrototypeOf(HorizontalArrows)).call(this, props));
  }

  _createClass(HorizontalArrows, [{
    key: 'render',
    value: function render() {
      var _this12 = this;

      var arrowIds = Array(5).fill().map(function (e, i) {
        return i;
      });
      return React.createElement(
        'div',
        { className: 'horizontal-arrows' },
        arrowIds.map(function (id) {
          return React.createElement(HorizontalArrow, {
            key: id,
            localId: id,
            symbol: _this12.props.direction == "right" ? '\uD83E\uDC46' : '\uD83E\uDC44',
            direction: _this12.props.direction,
            onClickFunc: _this12.props.onClickFunc,
            webSocket: _this12.props.webSocket,
            active: _this12.props.active,
            previousMove: _this12.props.previousMove
          });
        })
      );
    }
  }]);

  return HorizontalArrows;
}(React.Component);

var VerticalArrows = function (_React$Component10) {
  _inherits(VerticalArrows, _React$Component10);

  function VerticalArrows(props) {
    _classCallCheck(this, VerticalArrows);

    return _possibleConstructorReturn(this, (VerticalArrows.__proto__ || Object.getPrototypeOf(VerticalArrows)).call(this, props));
  }

  _createClass(VerticalArrows, [{
    key: 'render',
    value: function render() {
      var _this14 = this;

      var arrowIds = Array(5).fill().map(function (e, i) {
        return i;
      });
      return React.createElement(
        'div',
        { className: 'vertical-arrows' },
        arrowIds.map(function (id) {
          return React.createElement(VerticalArrow, {
            key: id,
            localId: id,
            symbol: _this14.props.direction == "down" ? '\uD83E\uDC47' : '\uD83E\uDC45',
            direction: _this14.props.direction,
            onClickFunc: _this14.props.onClickFunc,
            webSocket: _this14.props.webSocket,
            active: _this14.props.active,
            previousMove: _this14.props.previousMove
          });
        })
      );
    }
  }]);

  return VerticalArrows;
}(React.Component);

var HorizontalArrow = function (_React$Component11) {
  _inherits(HorizontalArrow, _React$Component11);

  function HorizontalArrow(props) {
    _classCallCheck(this, HorizontalArrow);

    var _this15 = _possibleConstructorReturn(this, (HorizontalArrow.__proto__ || Object.getPrototypeOf(HorizontalArrow)).call(this, props));

    _this15.handleClick = _this15.handleClick.bind(_this15);
    return _this15;
  }

  _createClass(HorizontalArrow, [{
    key: 'handleClick',
    value: function handleClick() {
      var actionParts = this.props.previousMove == null ? ["default;0"] : this.props.previousMove.split(";");
      if (!((actionParts[0] == "up" && this.props.direction == "down" || actionParts[0] == "down" && this.props.direction == "up" || actionParts[0] == "left" && this.props.direction == "right" || actionParts[0] == "right" && this.props.direction == "left") && actionParts[1] == this.props.localId)) {
        if (this.props.webSocket != null && this.props.active) {
          this.props.webSocket.send(JSON.stringify({
            message_type: "turn_message",
            message: "move;" + this.props.direction + ";" + this.props.localId
          }));
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'arrow horizontal-arrow', onClick: this.handleClick },
        this.props.symbol
      );
    }
  }]);

  return HorizontalArrow;
}(React.Component);

var VerticalArrow = function (_React$Component12) {
  _inherits(VerticalArrow, _React$Component12);

  function VerticalArrow(props) {
    _classCallCheck(this, VerticalArrow);

    var _this16 = _possibleConstructorReturn(this, (VerticalArrow.__proto__ || Object.getPrototypeOf(VerticalArrow)).call(this, props));

    _this16.handleClick = _this16.handleClick.bind(_this16);
    return _this16;
  }

  _createClass(VerticalArrow, [{
    key: 'handleClick',
    value: function handleClick() {
      var actionParts = this.props.previousMove == null ? ["default;0"] : this.props.previousMove.split(";");
      if (!((actionParts[0] == "up" && this.props.direction == "down" || actionParts[0] == "down" && this.props.direction == "up" || actionParts[0] == "left" && this.props.direction == "right" || actionParts[0] == "right" && this.props.direction == "left") && actionParts[1] == this.props.localId)) {
        if (this.props.webSocket != null && this.props.active) {
          this.props.webSocket.send(JSON.stringify({
            message_type: "turn_message",
            message: "move;" + this.props.direction + ";" + this.props.localId
          }));
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'arrow vertical-arrow', onClick: this.handleClick },
        this.props.symbol
      );
    }
  }]);

  return VerticalArrow;
}(React.Component);

var NoirCards = function (_React$Component13) {
  _inherits(NoirCards, _React$Component13);

  function NoirCards(props) {
    _classCallCheck(this, NoirCards);

    return _possibleConstructorReturn(this, (NoirCards.__proto__ || Object.getPrototypeOf(NoirCards)).call(this, props));
  }

  _createClass(NoirCards, [{
    key: 'render',
    value: function render() {
      var _this18 = this;

      var yourIndex = this.props.board.findIndex(function (info) {
        return info.name == _this18.props.currentPlayerRole;
      });
      var yourRow = yourIndex / 5 | 0;
      var yourColumn = yourIndex % 5;
      return React.createElement(
        'div',
        { className: 'desk flex-block' },
        this.props.board.map(function (info, i) {
          return React.createElement(NoirCard, {
            key: i,
            row: i / 5 | 0,
            column: i % 5,
            yourRow: yourRow,
            yourColumn: yourColumn,
            name: info.name,
            status: info.status,
            active: _this18.props.active,
            webSocket: _this18.props.webSocket,
            actionMod: _this18.props.actionMod,
            currentPlayerRole: _this18.props.currentPlayerRole
          });
        })
      );
    }
  }]);

  return NoirCards;
}(React.Component);

var NoirCard = function (_React$Component14) {
  _inherits(NoirCard, _React$Component14);

  function NoirCard(props) {
    _classCallCheck(this, NoirCard);

    var _this19 = _possibleConstructorReturn(this, (NoirCard.__proto__ || Object.getPrototypeOf(NoirCard)).call(this, props));

    _this19.state = {
      frameStyle: "card-frame"
    };
    _this19.onMouseEnter = _this19.onMouseEnter.bind(_this19);
    _this19.onMouseLeave = _this19.onMouseLeave.bind(_this19);
    _this19.sendAction = _this19.sendAction.bind(_this19);
    _this19.isCatchable = _this19.isCatchable.bind(_this19);
    _this19.isInterrogatable = _this19.isInterrogatable.bind(_this19);
    return _this19;
  }

  _createClass(NoirCard, [{
    key: 'onMouseEnter',
    value: function onMouseEnter() {
      if (this.isInterrogatable() || this.isCatchable()) this.setState({
        frameStyle: "card-frame selected"
      });
    }
  }, {
    key: 'onMouseLeave',
    value: function onMouseLeave() {
      this.setState({
        frameStyle: "card-frame"
      });
    }
  }, {
    key: 'isCatchable',
    value: function isCatchable() {
      return this.props.active && this.props.actionMod == "catch" && this.props.name != this.props.currentPlayerRole && this.props.status != 0 && Math.abs(this.props.row - this.props.yourRow) <= 1 && Math.abs(this.props.column - this.props.yourColumn) <= 1;
    }
  }, {
    key: 'isInterrogatable',
    value: function isInterrogatable() {
      return this.props.active && this.props.actionMod == "interrogate" && this.props.status != 0 && Math.abs(this.props.row - this.props.yourRow) <= 1 && Math.abs(this.props.column - this.props.yourColumn) <= 1;
    }
  }, {
    key: 'sendAction',
    value: function sendAction() {
      var temp = JSON.stringify({
        message_type: "turn_message",
        message: this.props.actionMod + ";" + this.props.row + ";" + this.props.column
      });
      console.log(temp);
      this.props.webSocket.send(temp);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this20 = this;

      return React.createElement(
        'div',
        {
          className: this.state.frameStyle,
          onMouseEnter: this.onMouseEnter,
          onMouseLeave: this.onMouseLeave
        },
        React.createElement(
          'div',
          {
            className: this.props.status == 1 ? "card-wrapper" : "card-wrapper caught",
            onClick: function onClick() {
              if (_this20.props.webSocket != null && _this20.props.actionMod != "shift") {
                if (_this20.isCatchable() || _this20.isInterrogatable()) _this20.sendAction();
              }
            }
          },
          React.createElement(
            'div',
            { className: 'card-inner' },
            React.createElement(
              'div',
              {
                className: "card-name" + (this.props.currentPlayerRole == this.props.name ? " your-card" : "")
              },
              this.props.name
            )
          )
        )
      );
    }
  }]);

  return NoirCard;
}(React.Component);

ReactDOM.render(React.createElement(GamePage, null), document.getElementById("root"));