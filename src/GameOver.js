import React from 'react';

export default ({ player1Name, player2Name, player1Score, player2Score, reset }) => {
  const isDrawn = player1Score === player2Score;
  const winner = player1Score < player2Score ? player1Name : player2Name;
  let resultComponent;
  if (isDrawn) {
    resultComponent = <div>It was a draw!</div>;
  } else {
    resultComponent = <div>{winner} Won!</div>;
  }

  return (
    <div className="gameResult">
      <div>
        {player1Name}: {player1Score}
      </div>
      <div>
        {player2Name}: {player2Score}
      </div>
      {resultComponent}
      <button onClick={reset}>Play Another Game</button>
    </div>
  );
}
