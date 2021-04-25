import HorizontalArrow from 'HorizontalArrow.js'

export default class HorizontalArrows extends React.Component {
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