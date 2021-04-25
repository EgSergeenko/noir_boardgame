import VerticalArrow from 'VerticalArrow.js'

export default class VerticalArrows extends React.Component {
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