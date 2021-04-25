import PlayerBadge from 'PlayerBadge.js'
import Turn from 'Turn.js'

export default class PlayersInfo extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      var scores = new Map(Object.entries(this.props.scores));
      return (
        <div className="block-wrapper">
          <div className="info-block">
            {this.props.players.map((nickname, i) => {
              if (this.props.currentPlayer == nickname)
                return (
                  <PlayerBadge
                    key={i}
                    nickname={nickname}
                    score={!!scores.get(nickname) ? scores.get(nickname) : 0}
                    current
                  />
                );
              return (
                <PlayerBadge
                  key={i}
                  nickname={nickname}
                  score={!!scores.get(nickname) ? scores.get(nickname) : 0}
                />
              );
            })}
            <Turn turn={this.props.turn} />
          </div>
        </div>
      );
    }
  }