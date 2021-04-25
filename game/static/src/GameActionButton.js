export default class GameActionButton extends React.Component {
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