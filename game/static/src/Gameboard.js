import VerticalArrows from 'VerticalArrows.js'
import HorizontalArrows from 'HorizontalArrows.js'
import NoirCards from 'NoirCards.js'

export default class Gameboard extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      return (
        <div className="column-wrapper">
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