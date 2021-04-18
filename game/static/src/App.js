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
                    return {name: e, status: 1};
                }),
                current_player_role: "1",
                scores: {default: "0"},
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
                this.state.log.push(data.message);
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
                                    <ActionLog log={this.state.log}/>
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
                    currentActionMod={this.props.actionMod}
                    changeActionModFunc={this.props.changeActionModFunc}
                />
                <GameActionButton
                    content="Catch"
                    actionMod="catch"
                    currentActionMod={this.props.actionMod}
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
            <div
                className={
                    this.props.actionMod == this.props.currentActionMod
                        ? "action-button active-button"
                        : "action-button"
                }
                onClick={this.changeActionMod}
            >
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
        var scores = new Map(Object.entries(this.props.scores));
        return (
            <div className="info-block">
                {this.props.players.map((nickname, i) => {
                    if (this.props.currentPlayer == nickname)
                        return (
                            <PlayerBadge
                                key={i}
                                nickname={nickname}
                                score={!!scores.get(nickname) ? scores.get(nickname) : 0}
                                current
                            />
                        );
                    return (
                        <PlayerBadge
                            key={i}
                            nickname={nickname}
                            score={!!scores.get(nickname) ? scores.get(nickname) : 0}
                        />
                    );
                })}
                <Turn turn={this.props.turn}/>
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
                <br/>
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

class ActionLog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className="info-block action-log">
                {this.props.log.map((l, i) => {
                    return (
                        <div key={i} className={i % 2 == 1 ? "dark-stripe" : "white-stripe"}>
                            {l}
                            <br/>
                        </div>
                    );
                })}
            </section>
        );
    }
}

class Gameboard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-fluid">
                <VerticalArrows
                    direction="up"
                    onClickFunc={this.handleArrowClick}
                    webSocket={this.props.webSocket}
                    active={this.props.active}
                    previousMove={this.props.previousMove}
                />
                <div className="flex-block">
                    <HorizontalArrows
                        direction="left"
                        onClickFunc={this.handleArrowClick}
                        webSocket={this.props.webSocket}
                        active={this.props.active}
                        previousMove={this.props.previousMove}
                    />
                    <NoirCards
                        board={this.props.board}
                        actionMod={this.props.actionMod}
                        currentPlayerRole={this.props.currentPlayerRole}
                        webSocket={this.props.webSocket}
                        active={this.props.active}
                        previousMove={this.props.previousMove}
                    />
                    <HorizontalArrows
                        direction="right"
                        onClickFunc={this.handleArrowClick}
                        webSocket={this.props.webSocket}
                        active={this.props.active}
                        previousMove={this.props.previousMove}
                    />
                </div>
                <VerticalArrows
                    direction="down"
                    onClickFunc={this.handleArrowClick}
                    webSocket={this.props.webSocket}
                    active={this.props.active}
                    previousMove={this.props.previousMove}
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
                            active={this.props.active}
                            previousMove={this.props.previousMove}
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
                            active={this.props.active}
                            previousMove={this.props.previousMove}
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
        var actionParts =
            this.props.previousMove == null
                ? ["default;0"]
                : this.props.previousMove.split(";");
        if (
            !(
                ((actionParts[0] == "up" && this.props.direction == "down") ||
                    (actionParts[0] == "down" && this.props.direction == "up") ||
                    (actionParts[0] == "left" && this.props.direction == "right") ||
                    (actionParts[0] == "right" && this.props.direction == "left")) &&
                actionParts[1] == this.props.localId
            )
        ) {
            if (this.props.webSocket != null && this.props.active) {
                this.props.webSocket.send(
                    JSON.stringify({
                        message_type: "turn_message",
                        message: "move;" + this.props.direction + ";" + this.props.localId,
                    })
                );
            }
        }
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
        var actionParts =
            this.props.previousMove == null
                ? ["default;0"]
                : this.props.previousMove.split(";");
        if (
            !(
                ((actionParts[0] == "up" && this.props.direction == "down") ||
                    (actionParts[0] == "down" && this.props.direction == "up") ||
                    (actionParts[0] == "left" && this.props.direction == "right") ||
                    (actionParts[0] == "right" && this.props.direction == "left")) &&
                actionParts[1] == this.props.localId
            )
        ) {
            if (this.props.webSocket != null && this.props.active) {
                this.props.webSocket.send(
                    JSON.stringify({
                        message_type: "turn_message",
                        message: "move;" + this.props.direction + ";" + this.props.localId,
                    })
                );
            }
        }
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
        let yourIndex = this.props.board.findIndex(
            (info) => info.name == this.props.currentPlayerRole
        );
        let yourRow = (yourIndex / 5) | 0;
        let yourColumn = yourIndex % 5;
        return (
            <div className="desk flex-block">
                {this.props.board.map((info, i) => {
                    return (
                        <NoirCard
                            key={i}
                            row={(i / 5) | 0}
                            column={i % 5}
                            yourRow={yourRow}
                            yourColumn={yourColumn}
                            name={info.name}
                            status={info.status}
                            active={this.props.active}
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
        this.sendAction = this.sendAction.bind(this);
        this.isCatchable = this.isCatchable.bind(this);
        this.isInterrogatable = this.isInterrogatable.bind(this);
    }

    onMouseEnter() {
        if (this.isInterrogatable() || this.isCatchable())
            this.setState({
                frameStyle: "card-frame selected",
            });
    }

    onMouseLeave() {
        this.setState({
            frameStyle: "card-frame",
        });
    }

    isCatchable() {
        return (
            this.props.active &&
            this.props.actionMod == "catch" &&
            this.props.name != this.props.currentPlayerRole &&
            this.props.status != 0 &&
            Math.abs(this.props.row - this.props.yourRow) <= 1 &&
            Math.abs(this.props.column - this.props.yourColumn) <= 1
        );
    }

    isInterrogatable() {
        return (
            this.props.active &&
            this.props.actionMod == "interrogate" &&
            this.props.status != 0 &&
            Math.abs(this.props.row - this.props.yourRow) <= 1 &&
            Math.abs(this.props.column - this.props.yourColumn) <= 1
        );
    }

    sendAction() {
        var temp = JSON.stringify({
            message_type: "turn_message",
            message:
                this.props.actionMod + ";" + this.props.row + ";" + this.props.column,
        });
        console.log(temp);
        this.props.webSocket.send(temp);
    }

    render() {
        return (
            <div
                className={this.state.frameStyle}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                <div
                    className={
                        this.props.status == 1 ? "card-wrapper" : "card-wrapper caught"
                    }
                    onClick={() => {
                        if (
                            this.props.webSocket != null &&
                            this.props.actionMod != "shift"
                        ) {
                            if (this.isCatchable() || this.isInterrogatable())
                                this.sendAction();
                        }
                    }}
                >
                    <div className="card-inner">
                        <div
                            className={
                                "card-name" +
                                (this.props.currentPlayerRole == this.props.name
                                    ? " your-card"
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

ReactDOM.render(<GamePage/>, document.getElementById("root"));