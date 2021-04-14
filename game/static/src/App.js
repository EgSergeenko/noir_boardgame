class HubPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <main>
          <div className="hub-block">
            <RoomTile roomName="Room 1" />
            <RoomTile roomName="Room 2" />
            <RoomTile roomName="Room 3" />
            <div className="float-left hub-button">Create</div>
          </div>
        </main>
      </div>
    );
  }
}

class RoomTile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="room-tile">
        <div className="float-left">{this.props.roomName}</div>
        <div className="float-right hub-button">Join</div>
      </div>
    );
  }
}

class GamePage extends React.Component {
  constructor(props) {
    super(props);
    this.changeActionMod = this.changeActionMod.bind(this);
    this.startGame = this.startGame.bind(this);
    this.dummyMove = this.dummyMove.bind(this);
    this.state = {
      actionMod: "shift",
      webSocket: null,
      gameInfo: {
        board: [
          {
            name: "1",
            status: "1",
          },
          {
            name: "2",
            status: "1",
          },
          {
            name: "3",
            status: "1",
          },
          {
            name: "4",
            status: "1",
          },
          {
            name: "5",
            status: "1",
          },
          {
            name: "6",
            status: "1",
          },
          {
            name: "7",
            status: "1",
          },
          {
            name: "8",
            status: "1",
          },
          {
            name: "9",
            status: "1",
          },
          {
            name: "10",
            status: "1",
          },
          {
            name: "11",
            status: "1",
          },
          {
            name: "12",
            status: "1",
          },
          {
            name: "13",
            status: "1",
          },
          {
            name: "14",
            status: "1",
          },
          {
            name: "15",
            status: "1",
          },
          {
            name: "16",
            status: "1",
          },
          {
            name: "17",
            status: "1",
          },
          {
            name: "18",
            status: "1",
          },
          {
            name: "19",
            status: "1",
          },
          {
            name: "20",
            status: "1",
          },
          {
            name: "21",
            status: "1",
          },
          {
            name: "22",
            status: "1",
          },
          {
            name: "23",
            status: "1",
          },
          {
            name: "24",
            status: "1",
          },
          {
            name: "25",
            status: "1",
          },
        ],
        current_player_role: "1",
      },
    };
  }

  startGame() {
    if (this.state.webSocket != null) {
      this.state.webSocket.send(
        JSON.stringify({
          message_type: "start_game_message",
          message: "start",
        })
      );
    }
  }

  dummyMove() {
    if (this.state.webSocket != null) {
      this.state.webSocket.send(
        JSON.stringify({
          message_type: "turn_message",
          message: "move;left;0",
        })
      );
    }
  }

  componentDidMount() {
    let roomName = window.location.href.split("/").slice(-1)[0];
    let gameSocket = new WebSocket(
      "ws://" + window.location.host + "/ws/game/" + roomName + "/"
    );

    gameSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.message_type == "game_info_message") {
        this.setState({
          gameInfo: data,
        });
      }
      console.log(data);
    };
    gameSocket.onclose = (e) => {
      console.error("Chat socket closed unexpectedly");
    };
    this.setState({
      webSocket: gameSocket,
    });
  }

  changeActionMod(newMode) {
    if (this.state.actionMod === newMode)
      this.setState({
        actionMod: "shift",
      });
    else
      this.setState({
        actionMod: newMode,
      });
  }

  render() {
    return (
      <div>
        <main>
          <button onClick={this.startGame}>start</button>
          <button onClick={this.dummyMove}>move</button>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-2">
                <div className="row">
                  <GameActions changeActionModFunc={this.changeActionMod} />
                </div>
                <div className="row">
                  <PlayersInfo />
                </div>
              </div>
              <div className="col-md-10">
                <Gameboard
                  actionMod={this.state.actionMod}
                  currentPlayerRole={this.state.gameInfo.current_player_role}
                  board={this.state.gameInfo.board}
                  webSocket={this.state.webSocket}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

class GameActions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="info-block">
        <GameActionButton
          content="Interrogate"
          actionMod="interrogate"
          changeActionModFunc={this.props.changeActionModFunc}
        />
        <GameActionButton
          content="Catch"
          actionMod="catch"
          changeActionModFunc={this.props.changeActionModFunc}
        />
      </div>
    );
  }
}

class GameActionButton extends React.Component {
  constructor(props) {
    super(props);
    this.changeActionMod = this.changeActionMod.bind(this);
  }

  changeActionMod() {
    this.props.changeActionModFunc(this.props.actionMod);
  }

  render() {
    return (
      <div className="action-button" onClick={this.changeActionMod}>
        {this.props.content}
      </div>
    );
  }
}

class PlayersInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="info-block">
        <PlayerBadge nickname="Kavrankaba" score="2" current />
        <PlayerBadge nickname="Osaverengeka" score="1" />
        <PlayerBadge nickname="Nikthar" score="2" />
        <Turn turn="2" />
      </div>
    );
  }
}

class PlayerBadge extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className={
          "player-badge" + (this.props.current ? " current-player" : " ")
        }
      >
        {this.props.nickname}
        <br />
        {"Score: " + this.props.score}
      </div>
    );
  }
}

class Turn extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="turn">
        <b>{"Turn: " + this.props.turn}</b>
      </div>
    );
  }
}

class Gameboard extends React.Component {
  constructor(props) {
    super(props);
    this.handleArrowClick = this.handleArrowClick.bind(this);
    this.state = {
      cardsInfo: Array(25)
        .fill()
        .map((e, i) => i + 1),
    };
  }

  handleArrowClick(arrowId, direction) {
    if (direction == "up") {
      this.setState({
        cardsInfo: this.state.cardsInfo.map((info, i, arr) => {
          if (i % 5 == arrowId) {
            return arr[(i + 5) % 25];
          } else {
            return info;
          }
        }),
      });
    }
    if (direction == "left") {
      this.setState({
        cardsInfo: this.state.cardsInfo.map((info, i, arr) => {
          if (((i / 5) | 0) == arrowId) {
            return arr[arrowId * 5 + ((i + 1) % 5)];
          } else {
            return info;
          }
        }),
      });
    }
    if (direction == "down") {
      this.setState({
        cardsInfo: this.state.cardsInfo.map((info, i, arr) => {
          if (i % 5 == arrowId) {
            return arr[(i + 20) % 25];
          } else {
            return info;
          }
        }),
      });
    }
    if (direction == "right") {
      this.setState({
        cardsInfo: this.state.cardsInfo.map((info, i, arr) => {
          if (((i / 5) | 0) == arrowId) {
            return arr[arrowId * 5 + ((i + 4) % 5)];
          } else {
            return info;
          }
        }),
      });
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <VerticalArrows
          direction="up"
          onClickFunc={this.handleArrowClick}
          webSocket={this.props.webSocket}
        />
        <div className="flex-block">
          <HorizontalArrows
            direction="left"
            onClickFunc={this.handleArrowClick}
            webSocket={this.props.webSocket}
          />
          <NoirCards
            board={this.props.board}
            actionMod={this.props.actionMod}
            currentPlayerRole={this.props.currentPlayerRole}
            webSocket={this.props.webSocket}
          />
          <HorizontalArrows
            direction="right"
            onClickFunc={this.handleArrowClick}
            webSocket={this.props.webSocket}
          />
        </div>
        <VerticalArrows
          direction="down"
          onClickFunc={this.handleArrowClick}
          webSocket={this.props.webSocket}
        />
      </div>
    );
  }
}

class HorizontalArrows extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let arrowIds = Array(5)
      .fill()
      .map((e, i) => i);

    return (
      <div className="horizontal-arrows">
        {arrowIds.map((id) => {
          return (
            <HorizontalArrow
              key={id}
              localId={id}
              symbol={
                this.props.direction == "right" ? "\u{1F846}" : "\u{1F844}"
              }
              direction={this.props.direction}
              onClickFunc={this.props.onClickFunc}
              webSocket={this.props.webSocket}
            />
          );
        })}
      </div>
    );
  }
}

class VerticalArrows extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let arrowIds = Array(5)
      .fill()
      .map((e, i) => i);

    return (
      <div className="vertical-arrows">
        {arrowIds.map((id) => {
          return (
            <VerticalArrow
              key={id}
              localId={id}
              symbol={
                this.props.direction == "down" ? "\u{1F847}" : "\u{1F845}"
              }
              direction={this.props.direction}
              onClickFunc={this.props.onClickFunc}
              webSocket={this.props.webSocket}
            />
          );
        })}
      </div>
    );
  }
}

class HorizontalArrow extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.props.webSocket != null) {
      this.props.webSocket.send(
        JSON.stringify({
          message_type: "turn_message",
          message: "move;" + this.props.direction + ";" + this.props.localId,
        })
      );
    }
    this.props.onClickFunc(this.props.localId, this.props.direction);
  }

  render() {
    return (
      <div className="arrow horizontal-arrow" onClick={this.handleClick}>
        {this.props.symbol}
      </div>
    );
  }
}

class VerticalArrow extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.props.webSocket != null) {
      this.props.webSocket.send(
        JSON.stringify({
          message_type: "turn_message",
          message: "move;" + this.props.direction + ";" + this.props.localId,
        })
      );
    }
    this.props.onClickFunc(this.props.localId, this.props.direction);
  }

  render() {
    return (
      <div className="arrow vertical-arrow" onClick={this.handleClick}>
        {this.props.symbol}
      </div>
    );
  }
}

class NoirCards extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="desk flex-block">
        {this.props.board.map((info, i) => {
          return (
            <NoirCard
              key={i}
              id={i}
              name={info.name}
              status={info.status}
              webSocket={this.props.webSocket}
              actionMod={this.props.actionMod}
              currentPlayerRole={this.props.currentPlayerRole}
            />
          );
        })}
      </div>
    );
  }
}

class NoirCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frameStyle: "card-frame",
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter() {
    if (
      this.props.actionMod === "interrogate" ||
      this.props.actionMod === "catch"
    )
      this.setState({
        frameStyle: "card-frame selected",
      });
  }

  onMouseLeave() {
    this.setState({
      frameStyle: "card-frame",
    });
  }

  render() {
    return (
      <div
        className={this.state.frameStyle}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <div
          className="card-wrapper"
          onClick={() => {
            if (
              this.props.webSocket != null &&
              this.props.actionMod != "shift"
            ) {
              if (
                this.props.actionMod == "catch" &&
                this.props.name != this.props.currentPlayerRole
              ) {
                this.props.webSocket.send(
                  JSON.stringify({
                    message_type: "turn_message",
                    message:
                      this.props.actionMod +
                      ";" +
                      ((this.props.id / 5) | 0) +
                      ";" +
                      (this.props.id % 5),
                  })
                );
              }
            }
          }}
        >
          <div className="card-inner">
            <div
              className={
                "card-name" +
                (this.props.currentPlayerRole == this.props.name
                  ? " current-player"
                  : "")
              }
            >
              {this.props.name}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<GamePage />, document.getElementById("root"));
