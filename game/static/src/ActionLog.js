export default class ActionLog extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      return (
        <div className="block-wrapper">
          <section className="info-block action-log">
            {this.props.log.map((l, i) => {
              return (
                <div
                  key={i}
                  className={i % 2 == 1 ? "dark-stripe" : "white-stripe"}
                >
                  {l}
                  <br />
                </div>
              );
            })}
          </section>
        </div>
      );
    }
  }