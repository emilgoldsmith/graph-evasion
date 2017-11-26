import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Board from './Board.js';

/* Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

class App extends Component {
  constructor() {
    super();
    const graph = this.generateGraph(10, 3, 7);
    this.state = {
      graph,
      hunterPos: { x: 0, y: 0 },
      preyPos: { x: graph.length - 1, y: graph[graph.length - 1].length - 1 },
      gameOver: false,
      huntersTurn: true,
      numBombs: 10,
    };
  }

  generateGraph = (numCols, minRows, maxRows) => {
    let graph = [];
    for (let i = 0; i < numCols; i += 1) {
      let col = [];
      const numRows = getRandomInt(minRows, maxRows);
      for (let j = 0; j < numRows; j += 1) {
        let neighbours = [];
        if (j > 0 && getRandomInt(0, 1) === 0) {
          neighbours.push({ x: i, y: j - 1 });
          col[j - 1].neighbours.push({ x: i, y: j });
        }
        if (i > 0) {
          graph[i - 1] = graph[i - 1].map((node, index) => {
            if (getRandomInt(0, 1) === 0) {
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
        return { gameOver: true };
      }
      if (!state.huntersTurn && state.graph[prey.x][prey.y].hasBomb) {
        return { gameOver: true };
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
    this.setState(state => ({ huntersTurn: !state.huntersTurn }));
    return true;
  }

  render() {
    const graphToRender = [];
    for (let j = 0; j < 10; j += 1) {
      let row = [];
      for (let i = 0; i < 10; i += 1) {
        if (this.state.graph[i].length > j) {
          if (this.state.hunterPos.x === i && this.state.hunterPos.y === j) {
            row.push(<span style={{color: 'red'}} key={`${i}-${j}`}>x</span>);
          } else if (this.state.preyPos.x === i && this.state.preyPos.y === j) {
            row.push(<span style={{color: 'darkOrange'}} key={`${i}-${j}`}>x</span>);
          } else {
            row.push('x');
          }
        } else {
          row.push('o');
        }
      }
      row.push(<br key={`break-row-${j}`} />);
      graphToRender.push(row);
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Board
          graph={this.state.graph}
          hunterX={this.state.hunterPos.x}
          hunterY={this.state.hunterPos.y}
          preyX={this.state.preyPos.x}
          preyY={this.state.preyPos.y}
          makeMove={this.makeMove}
          huntersTurn={this.state.huntersTurn}
          gameOver={this.state.gameOver}
        />
      </div>
    );
  }
}

export default App;
