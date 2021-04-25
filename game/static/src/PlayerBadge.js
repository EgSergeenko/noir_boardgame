export default class PlayerBadge extends React.Component {
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
          <div className="float-left">{this.props.nickname}</div>
          <div className="float-right">{this.props.score}</div>
        </div>
      );
    }
  }