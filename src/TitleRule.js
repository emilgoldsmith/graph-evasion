import React from 'react';

export default () => (
  <header>
    <h1>Graph Evasion</h1>
    <h2>
      There are two players, a hunter and a prey. The hunter's objective is to capture the prey (capture means being on the same node) in as few moves as possible, whereas the prey's objective is to avoid the hunter for as many moves as possible. During their turn, both the hunter and the prey can move to an adjacent node in the graph. However, the hunter also has the option of leaving a bomb at its location before moving to a new node. If a prey steps on a bomb, the game ends immediately. Note that although the number of bombs available is limited, the hunter may go back to where it placed the bomb to pick it up (bombs not affect the hunter).
    </h2>
  </header>
);
