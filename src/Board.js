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

  componentDidUpdate() {
    this.renderCanvas();
  }

  // coordinate conversion from graph to canvas
  g2c(i, isX = false) {
    if (isX) {
      return (3 * i + 1) * this.basePX;
    }
    return (2 * i + 1) * this.basePX;
  }

  // coordinate coversion from canvas to graph
  c2g(cX, cY) {
    for (let x = 0; x < this.dimension; x++) {
      const col = this.props.graph[x];
      for (let y = 0; y < col.length; y++) {
        const canvasX = this.g2c(x, true);
        const canvasY = this.g2c(y);
        const d2 = (cX - canvasX) * (cX - canvasX) + (cY - canvasY) * (cY - canvasY);
        if (d2 < this.basePX * this.basePX) {
          return { x, y };
        }
      }
    }
    return { x : -1, y : -1};
  }

  makeMove = (event) => {
    const rect = this.canvas.getBoundingClientRect();
    const graphCoordinate = this.c2g(event.clientX - rect.left, event.clientY - rect.top);
    if (graphCoordinate.x !== -1) {
      this.props.makeMove(
        graphCoordinate.x,
        graphCoordinate.y,
        this.props.huntersTurn && window.confirm("Place bomb?")
      );
    }
  }

  renderCanvas() {
    // get graph info
    const nodes = [];
    const edges = [];
    for (let x = 0; x < this.dimension; x++) {
      const col = this.props.graph[x];
      for (let y = 0; y < col.length; y++) {
        const canvasX = this.g2c(x, true);
        const canvasY = this.g2c(y);
        nodes.push({ x : canvasX, y : canvasY, hasBomb: col[y].hasBomb });
        for (const n of col[y].neighbours) {
          edges.push({ x1 : canvasX, y1 : canvasY, x2 : this.g2c(n.x, true), y2 : this.g2c(n.y)});
        }
      }
    }

    const ctx = this.canvas.getContext('2d');
    // set canvas size
    this.canvas.width = this.basePX * this.dimension * 3;
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
    for (const node of nodes) {
      ctx.beginPath();
      if (node.x === this.g2c(this.props.hunterX, true) && node.y === this.g2c(this.props.hunterY)) {
        ctx.fillStyle = this.colors.h;
      } else if (node.x === this.g2c(this.props.preyX, true) && node.y === this.g2c(this.props.preyY)) {
        ctx.fillStyle = this.colors.p;
      } else if (node.hasBomb) {
        ctx.fillStyle = this.colors.b;
      } else {
        ctx.fillStyle = this.colors.bg;
      }
      ctx.arc(node.x, node.y, this.basePX / 2, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.stroke();
    }
  }

  render() {
    return (
      <div>
        <header>
          <h1>Graph Evasion</h1>
          <div className="container">
            <span className="info">
              <span className="info-icon hunter"></span>
              <span className="info-text">Hunter</span>
            </span>
            <span className="info">
              <span className="info-icon prey"></span>
              <span className="info-text">Prey</span>
            </span>
            <span className="info">
              <span className="info-icon bomb"></span>
              <span className="info-text">Bomb Left: { this.props.numBombs } </span>
            </span>
            <span className="info">
              <span className="info-text">Moves made: { this.props.numMoves } </span>
            </span>
            <span className="info">
              <span className="info-text">{ this.props.gameOver ? 'Game over' : 'Game in progess' } </span>
            </span>
          </div>
        </header>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <canvas
            ref={(canvas) => { this.canvas = canvas; }}
            onClick={this.makeMove}
          >
          </canvas>
        </div>
      </div>
    )
  }
}

export default BoardCanvas;
