import React, { Component } from 'react';
import './App.css';
import BoardCanvas from './Board.js';
import Initialize from './Initialize.js';
import TitleRule from './TitleRule.js';
import GameOver from './GameOver.js';

/* Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      graph: null,
      hunterPos: null,
      preyPos: null,
      gameOver: false,
      huntersTurn: true,
      numBombs: 10,
      numMoves: 0,
      player1Name: null,
      player2Name: null,
      numCols: null,
      minRows: null,
      maxRows: null,
      player1Score: 0,
      player2Score: 0,
      secondGameStarted: false,
      intermediateState: false,
    };
  }

  generateGraph(numCols, minRows, maxRows) {
    let graph = [];
    for (let i = 0; i < numCols; i += 1) {
      let col = [];
      const numRows = getRandomInt(minRows, maxRows);
      for (let j = 0; j < numRows; j += 1) {
        let neighbours = [];
        if (j > 0) {
          neighbours.push({ x: i, y: j - 1 });
          col[j - 1].neighbours.push({ x: i, y: j });
        }
        if (i > 0) {
          graph[i - 1] = graph[i - 1].map((node, index) => {
            if (getRandomInt(0, 4) === 0) {
              neighbours.push({ x: i - 1, y: index });
              return {
                ...node,
                neighbours: [...node.neighbours, { x: i, y: j }],
              };
            }
            return node;
          });
        }
        col.push({ x: i, y: j, neighbours, hasBomb: false });
      }
      graph.push(col);
    }
    return graph;
  }

  finishGame = () => {
    if (!this.state.secondGameStarted) {
      const newGraph = this.state.graph.map(row => {
        return row.map(node => ({ ...node, hasBomb: false }));
      });
      return {
        graph: newGraph,
        player1Score: this.state.numMoves + this.state.huntersTurn,
        numMoves: 0,
        secondGameStarted: true,
        hunterPos: { x: 0, y: 0 },
        preyPos: { x: newGraph.length - 1, y: newGraph[newGraph.length - 1].length - 1 },
        huntersTurn: true,
        intermediateState: true,
      };
    } else {
      return {
        gameOver: true,
        player2Score: this.state.numMoves + this.state.huntersTurn,
        intermediateState: true,
      };
    }
  };

  /**
   * This function return false if the move was invalid (and therefore wasn't made)
   * and true if it was valid (and the move was therefore made)
   */
  makeMove = (x, y, placeBomb = false) => {
    if (this.state.gameOver) return false;
    const position = this.state.huntersTurn ? this.state.hunterPos : this.state.preyPos;
    const graph = this.state.graph;
    const neighbours = graph[position.x][position.y].neighbours;
    const isValidMove = neighbours.some(neighbourPosition => (
      x === neighbourPosition.x && y === neighbourPosition.y
    ));
    if (!isValidMove) {
      return false;
    }
    if (this.state.huntersTurn) {
      if (placeBomb) {
        this.setState(state => {
          const pos = state.hunterPos;
          const graphCopy = [ ...state.graph ];
          graphCopy[pos.x] = [ ...graphCopy[pos.x] ];
          graphCopy[pos.x][pos.y].hasBomb = true;
          return {
            graph: state.numBombs > 0 ? graphCopy : state.graph,
            numBombs: state.numBombs - 1,
          };
        });
      }
      this.setState({
        hunterPos: { x, y },
      });
    } else {
      this.setState({
        preyPos: { x, y },
      });
    }
    this.setState(state => {
      const hunter = state.hunterPos;
      const prey = state.preyPos;
      if (hunter.x === prey.x && hunter.y === prey.y) {
        return this.finishGame();
      }
      if (!state.huntersTurn && state.graph[prey.x][prey.y].hasBomb) {
        return this.finishGame();
      }
      if (state.huntersTurn && state.graph[hunter.x][hunter.y].hasBomb) {
        const pickUpBomb = window.confirm("would you like to pick up the bomb?");
        if (pickUpBomb) {
          const pos = hunter;
          const graphCopy = [ ...state.graph ];
          graphCopy[pos.x] = [ ...graphCopy[pos.x] ];
          graphCopy[pos.x][pos.y].hasBomb = false;
          return {
            graph: graphCopy,
            numBombs: state.numBombs + 1,
          };
        }
      }
      return {};
    });
    this.setState(state => {
      if (state.intermediateState) return { intermediateState: false };
      return {
        numMoves: state.numMoves + state.huntersTurn,
        huntersTurn: !state.huntersTurn,
      };
    });
    return true;
  }

  initialize = e => {
    e.preventDefault();
    const newGraph = this.generateGraph(e.target.numCols.value, e.target.minRows.value, e.target.maxRows.value);
    this.setState({
      graph: newGraph,
      player1Name: e.target.player1Name.value,
      player2Name: e.target.player2Name.value,
      numCols: e.target.numCols.value,
      minRows: e.target.minRows.value,
      maxRows: e.target.maxRows.value,
      hunterPos: { x: 0, y: 0 },
      preyPos: { x: newGraph.length - 1, y: newGraph[newGraph.length - 1].length - 1 },
    });
  };

  reset = () => {
    this.setState({
      graph: null,
      hunterPos: null,
      preyPos: null,
      gameOver: false,
      huntersTurn: true,
      numBombs: 10,
      numMoves: 0,
      player1Name: null,
      player2Name: null,
      numCols: null,
      minRows: null,
      maxRows: null,
      player1Score: 0,
      player2Score: 0,
      secondGameStarted: false,
      intermediateState: false,
    });
  }

  render() {
    const isInitialized = (
      this.state.player1Name !== null &&
      this.state.player2Name !== null &&
      this.state.numCols !== null &&
      this.state.minRows !== null &&
      this.state.maxRows !== null &&
      this.state.graph !== null &&
      this.state.hunterPos !== null &&
      this.state.preyPos !== null
    );

    let hunterName, preyName, currentName;
    if (!this.state.secondGameStarted) {
      hunterName = this.state.player1Name;
      preyName = this.state.player2Name;
      currentName = this.state.huntersTurn ? hunterName : preyName;
    } else {
      hunterName = this.state.player2Name;
      preyName = this.state.player1Name;
      currentName = this.state.huntersTurn ? hunterName : preyName;
    }

    let mainComponent;
    if (this.state.gameOver) {
      mainComponent = (
        <GameOver
          player1Name={this.state.player1Name}
          player2Name={this.state.player2Name}
          player1Score={this.state.player1Score}
          player2Score={this.state.player2Score}
          reset={this.reset}
        />
      );
    } else if (isInitialized) {
      mainComponent = (
        <BoardCanvas
          graph={this.state.graph}
          hunterX={this.state.hunterPos.x}
          hunterY={this.state.hunterPos.y}
          preyX={this.state.preyPos.x}
          preyY={this.state.preyPos.y}
          makeMove={this.makeMove}
          huntersTurn={this.state.huntersTurn}
          numBombs={this.state.numBombs}
          numMoves={this.state.numMoves}
          gameOver={this.state.gameOver}
          nameToPlay={currentName}
          hunterName={hunterName}
          preyName={preyName}
        />
      );
    } else {
      mainComponent = <Initialize initialize={this.initialize} />;
    }

    return (
      <div className="App">
        <TitleRule />
        {mainComponent}
      </div>
    );
  }
}

export default App;
