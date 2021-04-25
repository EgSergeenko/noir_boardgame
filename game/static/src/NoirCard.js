export default class NoirCard extends React.Component {
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