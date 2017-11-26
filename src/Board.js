import React, { Component } from 'react';

class Node extends Component {
  makeNodeSpecificMove = () => {
    this.props.makeMove(this.props.x, this.props.y, this.props.huntersTurn && window.confirm("Place bomb?"));
  }

  render() {
    let color = 'black';
    if (this.props.hunterPresent) {
      color = 'red';
    } else if (this.props.preyPresent) {
      color = 'darkOrange';
    }
    return (
      <span
        style={{ color }}
        onClick={this.makeNodeSpecificMove}
      > {this.props.hasBomb ? 'B' : 'x'} </span>
    );
  }
}

class Board extends Component {
  render() {
    const graphToRender = [];
    for (let j = 0; j < 10; j += 1) {
      const row = [];
      for (let i = 0; i < 10; i += 1) {
        if (this.props.graph[i].length > j) {
          row.push(
            <Node
              key={`${i}-${j}`}
              x={i}
              y={j}
              makeMove={this.props.makeMove}
              hunterPresent={this.props.hunterX === i && this.props.hunterY === j}
              preyPresent={this.props.preyX === i && this.props.preyY === j}
              huntersTurn={this.props.huntersTurn}
              hasBomb={this.props.graph[i][j].hasBomb}
            />
          );
        } else {
          row.push(' o ');
        }
      }
      row.push(<br key={`break-row-${j}`} />);
      graphToRender.push(row);
    }
    return (
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <div style={{textAlign: 'left'}}>
          {graphToRender}
        </div>
      </div>
    );
  }
}

export default Board;
