var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HubPage = function (_React$Component) {
  _inherits(HubPage, _React$Component);

  function HubPage(props) {
    _classCallCheck(this, HubPage);

    return _possibleConstructorReturn(this, (HubPage.__proto__ || Object.getPrototypeOf(HubPage)).call(this, props));
  }

  _createClass(HubPage, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "header",
          null,
          React.createElement(
            "div",
            { className: "container-fluid header-content fixed-top" },
            React.createElement(
              "div",
              { className: "row" },
              React.createElement("div", { className: "col" }),
              React.createElement(
                "div",
                { className: "col" },
                React.createElement(
                  "div",
                  { className: "logo" },
                  React.createElement(
                    "u",
                    null,
                    "NOIR"
                  )
                )
              ),
              React.createElement(
                "div",
                { className: "col" },
                React.createElement(
                  "div",
                  { className: "float-right header-label" },
                  "Kavrankaba"
                )
              )
            )
          )
        ),
        React.createElement(
          "main",
          null,
          React.createElement(
            "div",
            { className: "hub-block" },
            React.createElement(RoomTile, { roomName: "Room 1" }),
            React.createElement(RoomTile, { roomName: "Room 2" }),
            React.createElement(RoomTile, { roomName: "Room 3" }),
            React.createElement(
              "div",
              { className: "float-left hub-button" },
              "Create"
            )
          )
        )
      );
    }
  }]);

  return HubPage;
}(React.Component);

var RoomTile = function (_React$Component2) {
  _inherits(RoomTile, _React$Component2);

  function RoomTile(props) {
    _classCallCheck(this, RoomTile);

    return _possibleConstructorReturn(this, (RoomTile.__proto__ || Object.getPrototypeOf(RoomTile)).call(this, props));
  }

  _createClass(RoomTile, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "room-tile" },
        React.createElement(
          "div",
          { className: "float-left" },
          this.props.roomName
        ),
        React.createElement(
          "div",
          { className: "float-right hub-button" },
          "Join"
        )
      );
    }
  }]);

  return RoomTile;
}(React.Component);

var GamePage = function (_React$Component3) {
  _inherits(GamePage, _React$Component3);

  function GamePage(props) {
    _classCallCheck(this, GamePage);

    var _this3 = _possibleConstructorReturn(this, (GamePage.__proto__ || Object.getPrototypeOf(GamePage)).call(this, props));

    _this3.changeActionMod = _this3.changeActionMod.bind(_this3);
    _this3.state = {
      actionMod: "shift",
      currentPlayerRole: "7"
    };
    return _this3;
  }

  _createClass(GamePage, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var chatSocket = new WebSocket("ws://" + window.location.host + "/ws/game/" + "qwe" + "/");

      chatSocket.onmessage = function (e) {
        var data = JSON.parse(e.data);
        console.log(data);
      };

      chatSocket.send(JSON.stringify({
        message_type: "start_game_message",
        message: message
      }));
    }
  }, {
    key: "changeActionMod",
    value: function changeActionMod(newMode) {
      if (this.state.actionMod === newMode) this.setState({
        actionMod: "shift"
      });else this.setState({
        actionMod: newMode
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "header",
          null,
          React.createElement(
            "div",
            { className: "container-fluid header-content fixed-top" },
            React.createElement(
              "div",
              { className: "row" },
              React.createElement(
                "div",
                { className: "col" },
                React.createElement(
                  "div",
                  { className: "float-left header-label" },
                  "\u2BA8 Room name"
                )
              ),
              React.createElement(
                "div",
                { className: "col" },
                React.createElement(
                  "div",
                  { className: "logo" },
                  React.createElement(
                    "u",
                    null,
                    "NOIR"
                  )
                )
              ),
              React.createElement(
                "div",
                { className: "col" },
                React.createElement(
                  "div",
                  { className: "float-right header-label" },
                  "Kavrankaba"
                )
              )
            )
          )
        ),
        React.createElement(
          "main",
          null,
          React.createElement(
            "div",
            { className: "container-fluid" },
            React.createElement(
              "div",
              { className: "row" },
              React.createElement(
                "div",
                { className: "col-md-2" },
                React.createElement(
                  "div",
                  { className: "row" },
                  React.createElement(GameActions, { changeActionModFunc: this.changeActionMod })
                ),
                React.createElement(
                  "div",
                  { className: "row" },
                  React.createElement(PlayersInfo, null)
                )
              ),
              React.createElement(
                "div",
                { className: "col-md-10" },
                React.createElement(Gameboard, {
                  actionMod: this.state.actionMod,
                  currentPlayerRole: this.state.currentPlayerRole
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

var GameActions = function (_React$Component4) {
  _inherits(GameActions, _React$Component4);

  function GameActions(props) {
    _classCallCheck(this, GameActions);

    return _possibleConstructorReturn(this, (GameActions.__proto__ || Object.getPrototypeOf(GameActions)).call(this, props));
  }

  _createClass(GameActions, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "info-block" },
        React.createElement(GameActionButton, {
          content: "Interrogate",
          actionMod: "interrogate",
          changeActionModFunc: this.props.changeActionModFunc
        }),
        React.createElement(GameActionButton, {
          content: "Catch",
          actionMod: "catch",
          changeActionModFunc: this.props.changeActionModFunc
        })
      );
    }
  }]);

  return GameActions;
}(React.Component);

var GameActionButton = function (_React$Component5) {
  _inherits(GameActionButton, _React$Component5);

  function GameActionButton(props) {
    _classCallCheck(this, GameActionButton);

    var _this5 = _possibleConstructorReturn(this, (GameActionButton.__proto__ || Object.getPrototypeOf(GameActionButton)).call(this, props));

    _this5.changeActionMod = _this5.changeActionMod.bind(_this5);
    return _this5;
  }

  _createClass(GameActionButton, [{
    key: "changeActionMod",
    value: function changeActionMod() {
      this.props.changeActionModFunc(this.props.actionMod);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "action-button", onClick: this.changeActionMod },
        this.props.content
      );
    }
  }]);

  return GameActionButton;
}(React.Component);

var PlayersInfo = function (_React$Component6) {
  _inherits(PlayersInfo, _React$Component6);

  function PlayersInfo(props) {
    _classCallCheck(this, PlayersInfo);

    return _possibleConstructorReturn(this, (PlayersInfo.__proto__ || Object.getPrototypeOf(PlayersInfo)).call(this, props));
  }

  _createClass(PlayersInfo, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "info-block" },
        React.createElement(PlayerBadge, { nickname: "Kavrankaba", score: "2", current: true }),
        React.createElement(PlayerBadge, { nickname: "Osaverengeka", score: "1" }),
        React.createElement(PlayerBadge, { nickname: "Nikthar", score: "2" }),
        React.createElement(Turn, { turn: "2" })
      );
    }
  }]);

  return PlayersInfo;
}(React.Component);

var PlayerBadge = function (_React$Component7) {
  _inherits(PlayerBadge, _React$Component7);

  function PlayerBadge(props) {
    _classCallCheck(this, PlayerBadge);

    return _possibleConstructorReturn(this, (PlayerBadge.__proto__ || Object.getPrototypeOf(PlayerBadge)).call(this, props));
  }

  _createClass(PlayerBadge, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        {
          className: "player-badge" + (this.props.current ? " current-player" : " ")
        },
        this.props.nickname,
        React.createElement("br", null),
        "Score: " + this.props.score
      );
    }
  }]);

  return PlayerBadge;
}(React.Component);

var Turn = function (_React$Component8) {
  _inherits(Turn, _React$Component8);

  function Turn(props) {
    _classCallCheck(this, Turn);

    return _possibleConstructorReturn(this, (Turn.__proto__ || Object.getPrototypeOf(Turn)).call(this, props));
  }

  _createClass(Turn, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "turn" },
        React.createElement(
          "b",
          null,
          "Turn: " + this.props.turn
        )
      );
    }
  }]);

  return Turn;
}(React.Component);

var Gameboard = function (_React$Component9) {
  _inherits(Gameboard, _React$Component9);

  function Gameboard(props) {
    _classCallCheck(this, Gameboard);

    var _this9 = _possibleConstructorReturn(this, (Gameboard.__proto__ || Object.getPrototypeOf(Gameboard)).call(this, props));

    _this9.handleArrowClick = _this9.handleArrowClick.bind(_this9);
    _this9.state = {
      cardsInfo: Array(25).fill().map(function (e, i) {
        return i + 1;
      })
    };
    return _this9;
  }

  _createClass(Gameboard, [{
    key: "handleArrowClick",
    value: function handleArrowClick(arrowId, direction) {
      if (direction == "top") {
        this.setState({
          cardsInfo: this.state.cardsInfo.map(function (info, i, arr) {
            if (i % 5 == arrowId) {
              return arr[(i + 5) % 25];
            } else {
              return info;
            }
          })
        });
      }
      if (direction == "left") {
        this.setState({
          cardsInfo: this.state.cardsInfo.map(function (info, i, arr) {
            if ((i / 5 | 0) == arrowId) {
              return arr[arrowId * 5 + (i + 1) % 5];
            } else {
              return info;
            }
          })
        });
      }
      if (direction == "down") {
        this.setState({
          cardsInfo: this.state.cardsInfo.map(function (info, i, arr) {
            if (i % 5 == arrowId) {
              return arr[(i + 20) % 25];
            } else {
              return info;
            }
          })
        });
      }
      if (direction == "right") {
        this.setState({
          cardsInfo: this.state.cardsInfo.map(function (info, i, arr) {
            if ((i / 5 | 0) == arrowId) {
              return arr[arrowId * 5 + (i + 4) % 5];
            } else {
              return info;
            }
          })
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "container-fluid" },
        React.createElement(VerticalArrows, { direction: "top", onClickFunc: this.handleArrowClick }),
        React.createElement(
          "div",
          { className: "flex-block" },
          React.createElement(HorizontalArrows, {
            direction: "left",
            onClickFunc: this.handleArrowClick
          }),
          React.createElement(NoirCards, {
            cardsInfo: this.state.cardsInfo,
            actionMod: this.props.actionMod,
            currentPlayerRole: this.props.currentPlayerRole
          }),
          React.createElement(HorizontalArrows, {
            direction: "right",
            onClickFunc: this.handleArrowClick
          })
        ),
        React.createElement(VerticalArrows, { direction: "down", onClickFunc: this.handleArrowClick })
      );
    }
  }]);

  return Gameboard;
}(React.Component);

var HorizontalArrows = function (_React$Component10) {
  _inherits(HorizontalArrows, _React$Component10);

  function HorizontalArrows(props) {
    _classCallCheck(this, HorizontalArrows);

    return _possibleConstructorReturn(this, (HorizontalArrows.__proto__ || Object.getPrototypeOf(HorizontalArrows)).call(this, props));
  }

  _createClass(HorizontalArrows, [{
    key: "render",
    value: function render() {
      var _this11 = this;

      var arrowIds = Array(5).fill().map(function (e, i) {
        return i;
      });

      return React.createElement(
        "div",
        { className: "horizontal-arrows" },
        arrowIds.map(function (id) {
          return React.createElement(HorizontalArrow, {
            key: id,
            localId: id,
            symbol: _this11.props.direction == "right" ? "\uD83E\uDC46" : "\uD83E\uDC44",
            direction: _this11.props.direction,
            onClickFunc: _this11.props.onClickFunc
          });
        })
      );
    }
  }]);

  return HorizontalArrows;
}(React.Component);

var VerticalArrows = function (_React$Component11) {
  _inherits(VerticalArrows, _React$Component11);

  function VerticalArrows(props) {
    _classCallCheck(this, VerticalArrows);

    return _possibleConstructorReturn(this, (VerticalArrows.__proto__ || Object.getPrototypeOf(VerticalArrows)).call(this, props));
  }

  _createClass(VerticalArrows, [{
    key: "render",
    value: function render() {
      var _this13 = this;

      var arrowIds = Array(5).fill().map(function (e, i) {
        return i;
      });

      return React.createElement(
        "div",
        { className: "vertical-arrows" },
        arrowIds.map(function (id) {
          return React.createElement(VerticalArrow, {
            key: id,
            localId: id,
            symbol: _this13.props.direction == "down" ? "\uD83E\uDC47" : "\uD83E\uDC45",
            direction: _this13.props.direction,
            onClickFunc: _this13.props.onClickFunc
          });
        })
      );
    }
  }]);

  return VerticalArrows;
}(React.Component);

var HorizontalArrow = function (_React$Component12) {
  _inherits(HorizontalArrow, _React$Component12);

  function HorizontalArrow(props) {
    _classCallCheck(this, HorizontalArrow);

    var _this14 = _possibleConstructorReturn(this, (HorizontalArrow.__proto__ || Object.getPrototypeOf(HorizontalArrow)).call(this, props));

    _this14.handleClick = _this14.handleClick.bind(_this14);
    return _this14;
  }

  _createClass(HorizontalArrow, [{
    key: "handleClick",
    value: function handleClick() {
      this.props.onClickFunc(this.props.localId, this.props.direction);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "arrow horizontal-arrow", onClick: this.handleClick },
        this.props.symbol
      );
    }
  }]);

  return HorizontalArrow;
}(React.Component);

var VerticalArrow = function (_React$Component13) {
  _inherits(VerticalArrow, _React$Component13);

  function VerticalArrow(props) {
    _classCallCheck(this, VerticalArrow);

    var _this15 = _possibleConstructorReturn(this, (VerticalArrow.__proto__ || Object.getPrototypeOf(VerticalArrow)).call(this, props));

    _this15.handleClick = _this15.handleClick.bind(_this15);
    return _this15;
  }

  _createClass(VerticalArrow, [{
    key: "handleClick",
    value: function handleClick() {
      this.props.onClickFunc(this.props.localId, this.props.direction);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "arrow vertical-arrow", onClick: this.handleClick },
        this.props.symbol
      );
    }
  }]);

  return VerticalArrow;
}(React.Component);

var NoirCards = function (_React$Component14) {
  _inherits(NoirCards, _React$Component14);

  function NoirCards(props) {
    _classCallCheck(this, NoirCards);

    return _possibleConstructorReturn(this, (NoirCards.__proto__ || Object.getPrototypeOf(NoirCards)).call(this, props));
  }

  _createClass(NoirCards, [{
    key: "render",
    value: function render() {
      var _this17 = this;

      return React.createElement(
        "div",
        { className: "desk flex-block" },
        this.props.cardsInfo.map(function (info) {
          return React.createElement(NoirCard, {
            key: info,
            name: info,
            actionMod: _this17.props.actionMod,
            currentPlayerRole: _this17.props.currentPlayerRole
          });
        })
      );
    }
  }]);

  return NoirCards;
}(React.Component);

var NoirCard = function (_React$Component15) {
  _inherits(NoirCard, _React$Component15);

  function NoirCard(props) {
    _classCallCheck(this, NoirCard);

    var _this18 = _possibleConstructorReturn(this, (NoirCard.__proto__ || Object.getPrototypeOf(NoirCard)).call(this, props));

    _this18.state = {
      frameStyle: "card-frame"
    };
    _this18.onMouseEnter = _this18.onMouseEnter.bind(_this18);
    _this18.onMouseLeave = _this18.onMouseLeave.bind(_this18);
    return _this18;
  }

  _createClass(NoirCard, [{
    key: "onMouseEnter",
    value: function onMouseEnter() {
      if (this.props.actionMod === "interrogate" || this.props.actionMod === "catch") this.setState({
        frameStyle: "card-frame selected"
      });
      console.log(this.state.frameStyle);
    }
  }, {
    key: "onMouseLeave",
    value: function onMouseLeave() {
      this.setState({
        frameStyle: "card-frame"
      });
      console.log(this.state.frameStyle);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        {
          className: this.state.frameStyle,
          onMouseEnter: this.onMouseEnter,
          onMouseLeave: this.onMouseLeave
        },
        React.createElement(
          "div",
          { className: "card-wrapper" },
          React.createElement(
            "div",
            { className: "card-inner" },
            React.createElement(
              "div",
              {
                className: "card-name" + (this.props.currentPlayerRole == this.props.name ? " current-player" : "")
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