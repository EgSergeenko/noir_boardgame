import GameActions from 'GameActions.js';
import PlayersInfo from 'PlayersInfo.js';
import Gameboard from 'Gameboard.js';
import ActionLog from 'ActionLog.js';

const NAMES = [
  "Quniton",
  "Geneva",
  "Trevor",
  "Simon",
  "Vladimir",
  "Yvonne",
  "Kristoph",
  "Ernest",
  "Irma",
  "Marion",
  "Ophelia",
  "Neil",
  "Barrin",
  "Wilhelm",
  "Phoebe",
  "Zachary",
  "Horatio",
  "Deidre",
  "Alyss",
  "Clive",
  "Udstad",
  "Ryan",
  "Julian",
  "Franklin",
  "Linus",
];

class GamePage extends React.Component {
  constructor(props) {
    super(props);
    this.changeActionMod = this.changeActionMod.bind(this);
    this.startGame = this.startGame.bind(this);
    this.state = {
      yourName: "default",
      actionMod: "shift",
      webSocket: null,
      log: [],
      players: ["default"],
      gameInfo: {
        board: NAMES.map((e) => {
          return { name: e, status: 1 };
        }),
        current_player_role: "1",
        scores: { default: "0" },
        game_current_player: "default",
        turn_counter: "0",
        previous_move: "default;0;0",
        message: "",
        winner: "default",
      },
    };
  }

  startGame() {
    if (this.state.webSocket != null) {
      this.state.webSocket.send(
        JSON.stringify({
          message_type: "start_game_message",
          message: "Game starts!",
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
          actionMod: "shift",
        });
        if (data.message.includes("moves")) {
          let sound = new Audio("/static/sounds/move.mp3");
          sound.play();
        }
        if (data.message.includes("catches")) {
          let sound = new Audio("/static/sounds/catch.mp3");
          sound.play();
        }
        if (data.message.includes("interrogates")) {
          let sound = new Audio("/static/sounds/interrogate.mp3");
          sound.play();
        }
        this.state.log.unshift(data.message);
        this.setState({
          log: this.state.log,
        });
      }
      if (data.message_type == "new_player_message") {
        this.setState({
          players: data.players,
          yourName: data.current_player,
        });
      }
      if (data.message_type == "player_left_message") {
        this.setState({
          players: data.players,
        });
      }
      if (
        data.message_type == "game_is_ready_message" &&
        this.state.yourName == this.state.players[0]
      ) {
        this.startGame();
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
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-2">
                <div className="row">
                  <GameActions
                    changeActionModFunc={this.changeActionMod}
                    actionMod={this.state.actionMod}
                  />
                </div>
                <div className="row">
                  <PlayersInfo
                    players={this.state.players}
                    scores={this.state.gameInfo.scores}
                    currentPlayer={this.state.gameInfo.game_current_player}
                    turn={this.state.gameInfo.turn_counter}
                  />
                </div>
                <div className="row">
                  <ActionLog log={this.state.log} />
                </div>
              </div>
              <div className="col-md-10">
                <Gameboard
                  actionMod={this.state.actionMod}
                  currentPlayerRole={this.state.gameInfo.current_player_role}
                  board={this.state.gameInfo.board}
                  webSocket={this.state.webSocket}
                  active={
                    this.state.yourName ==
                      this.state.gameInfo.game_current_player &&
                    this.state.gameInfo.winner == null
                  }
                  previousMove={this.state.gameInfo.previous_move}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

ReactDOM.render(<GamePage />, document.getElementById("root"));
