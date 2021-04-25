import NoirCard from 'NoirCard.js'

export default class NoirCards extends React.Component {
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