class HubPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <main>
                    <div className="hub-block">
                        <RoomTile roomName="Room 1"/>
                        <RoomTile roomName="Room 2"/>
                        <RoomTile roomName="Room 3"/>
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
        this.state = {
            actionMod: "shift",
            currentPlayerRole: "7",
        };
    }

    componentDidMount() {
        let roomName = window.location.href.split('/').slice(-1)[0];
        const chatSocket = new WebSocket(
            "ws://" + window.location.host + "/ws/game/" + roomName + "/"
        );

        chatSocket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            console.log(data);
        };

        chatSocket.onclose = function (e) {
            console.error('Chat socket closed unexpectedly');
        };

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
                                    <GameActions changeActionModFunc={this.changeActionMod}/>
                                </div>
                                <div className="row">
                                    <PlayersInfo/>
                                </div>
                            </div>
                            <div className="col-md-10">
                                <Gameboard
                                    actionMod={this.state.actionMod}
                                    currentPlayerRole={this.state.currentPlayerRole}
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
                <PlayerBadge nickname="Kavrankaba" score="2" current/>
                <PlayerBadge nickname="Osaverengeka" score="1"/>
                <PlayerBadge nickname="Nikthar" score="2"/>
                <Turn turn="2"/>
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
        if (direction == "top") {
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
                <VerticalArrows direction="top" onClickFunc={this.handleArrowClick}/>
                <div className="flex-block">
                    <HorizontalArrows
                        direction="left"
                        onClickFunc={this.handleArrowClick}
                    />
                    <NoirCards
                        cardsInfo={this.state.cardsInfo}
                        actionMod={this.props.actionMod}
                        currentPlayerRole={this.props.currentPlayerRole}
                    />
                    <HorizontalArrows
                        direction="right"
                        onClickFunc={this.handleArrowClick}
                    />
                </div>
                <VerticalArrows direction="down" onClickFunc={this.handleArrowClick}/>
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
                {this.props.cardsInfo.map((info) => {
                    return (
                        <NoirCard
                            key={info}
                            name={info}
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
        console.log(this.state.frameStyle);
    }

    onMouseLeave() {
        this.setState({
            frameStyle: "card-frame",
        });
        console.log(this.state.frameStyle);
    }

    render() {
        return (
            <div
                className={this.state.frameStyle}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                <div className="card-wrapper">
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

ReactDOM.render(<GamePage/>, document.getElementById("root"));
