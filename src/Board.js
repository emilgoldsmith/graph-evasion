import React, { Component } from 'react';

class BoardCanvas extends Component {
  constructor() {
    super();
    this.basePX = 30;
    this.lineWidth = 1;
    this.colors = {
      bg : '#ffffff',
      fg : '#000000',
      h : '#00ff00',
      p : '#0000ff',
      b : '#ff0000'
    };
    this.font = `${this.basePX * 0.7}px Arial`;
  }

  componentDidMount() {
    this.dimension = this.props.graph.length;
    this.renderCanvas();
  }

  componentWillUpdate() {
    this.renderCanvas();
  }

  // coordinate conversion from graph to canvas
  g2c(i) {
    return (2 * i + 1) * this.basePX;
  }

  renderCanvas() {
    // get graph info
    const nodes = [];
    const edges = [];
    for (let x = 0; x < this.dimension; x++) {
      const col = this.props.graph[x];
      for (let y = 0; y < col.length; y++) {
        const graphX = this.g2c(x);
        const graphY = this.g2c(y);
        nodes.push({ x : graphX, y : graphY, hasBomb: col[y].hasBomb });
        for (const n of col[y].neighbours) {
          edges.push({ x1 : graphX, y1 : graphY, x2 : this.g2c(n.x), y2 : this.g2c(n.y)});
        }
      }
    }

    const ctx = this.canvas.getContext('2d');
    // set canvas size
    this.canvas.width = this.basePX * this.dimension * 2;
    this.canvas.height = this.basePX * this.dimension * 2;
    // draw background
    ctx.fillStyle = this.colors.bg;
    ctx.fillRect(0, 0, this.dimension * this.basePX * 2, this.dimension * this.basePX * 2);
    // draw edges
    ctx.strokeStyle = this.colors.fg;
    ctx.lineWidth = 1.5;
    for (const edge of edges) {
      ctx.beginPath();
      ctx.moveTo(edge.x1, edge.y1);
      ctx.lineTo(edge.x2, edge.y2);
      ctx.stroke();
    }
    // draw nodes
    ctx.font = this.font;
    console.log(ctx.font);
    for (const node of nodes) {
      ctx.beginPath();
      if (node.x === this.g2c(this.props.hunterX) && node.y === this.g2c(this.props.hunterY)) {
        ctx.fillStyle = this.colors.h;
      } else if (node.x === this.g2c(this.props.preyX) && node.y === this.g2c(this.props.preyY)) {
        ctx.fillStyle = this.colors.p;
      } else {
        ctx.fillStyle = this.colors.bg;
      }
      ctx.arc(node.x, node.y, this.basePX / 2, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.stroke();
      // draw bomb
      ctx.fillStyle = this.colors.fg;
      if (node.hasBomb) {
        ctx.fillText('B', node.x, node.y);
      }
    }
  }

  render() {
    return (
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <canvas
          ref={(canvas) => { this.canvas = canvas; }}
        >
        </canvas>
      </div>
    )
  }
}

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

export default BoardCanvas;
