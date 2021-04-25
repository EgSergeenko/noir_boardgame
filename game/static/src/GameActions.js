import GameActionButton from 'GameActionButton.js'

export default class GameActions extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      return (
        <div className="block-wrapper">
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
        </div>
      );
    }
  }