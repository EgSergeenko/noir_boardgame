export default class VerticalArrow extends React.Component {
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
        <div
          className={
            this.props.active === true
              ? "arrow vertical-arrow enabled-arrow"
              : "arrow vertical-arrow"
          }
          onClick={this.handleClick}
        >
          {this.props.symbol}
        </div>
      );
    }
  }