export default class Turn extends React.Component {
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