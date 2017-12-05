import React, { Component } from 'react';

class BoardCanvas extends Component {
  constructor() {
    super();
    this.lineWidth = 1;
    this.colors = {
      bg : '#ffffff',
      fg : '#000000',
      h : '#00ff00',
      p : '#0000ff',
      b : '#ff0000'
    };
  }

  componentDidMount() {
    this.dimension = this.props.graph.length;
    // get appropriate basePX based on width
    const scale = 0.95;
    const widthBased = Math.floor(scale * this.canvas.parentNode.clientWidth / (this.dimension * 3));
    const heightBased = Math.floor(scale * window.innerHeight / (this.dimension * 2));
    this.basePX = Math.min(widthBased, heightBased);
    // set canvas size
    this.canvas.width = this.basePX * this.dimension * 3;
    this.canvas.height = this.basePX * this.dimension * 2;
    this.renderCanvas();
  }

  componentDidUpdate() {
    this.renderCanvas();
  }

  // coordinate conversion from graph to canvas
  g2cX(x) {
    return (3 * x + 1) * this.basePX;
  }

  g2cY(y, colSize) {
    const gap = (this.dimension - colSize) * 2 * this.basePX;
    const unitGap = gap / (colSize + 1);
    return (2 * y + 1) * this.basePX + (y + 1) * unitGap;
  }

  // coordinate coversion from canvas to graph
  c2g(cX, cY) {
    for (let x = 0; x < this.dimension; x++) {
      const col = this.props.graph[x];
      for (let y = 0; y < col.length; y++) {
        const canvasX = this.g2cX(x);
        const canvasY = this.g2cY(y, col.length);
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
        const canvasX = this.g2cX(x);
        const canvasY = this.g2cY(y, col.length);
        nodes.push({ x : canvasX, y : canvasY, hasBomb: col[y].hasBomb });
        for (const n of col[y].neighbours) {
          edges.push({
            x1 : canvasX, y1 : canvasY,
            x2 : this.g2cX(n.x), y2 : this.g2cY(n.y, this.props.graph[n.x].length)
          });
        }
      }
    }

    const ctx = this.canvas.getContext('2d');
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
    for (const node of nodes) {
      ctx.beginPath();
      const hunterColSize = this.props.graph[this.props.hunterX].length;
      const preyColSize = this.props.graph[this.props.preyX].length;
      if (node.x === this.g2cX(this.props.hunterX) && node.y === this.g2cY(this.props.hunterY, hunterColSize)) {
        ctx.fillStyle = this.colors.h;
      } else if (node.x === this.g2cX(this.props.preyX) && node.y === this.g2cY(this.props.preyY, preyColSize)) {
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
        <div className="container">
          <span className="info">
            <span className="info-icon hunter"></span>
            <span className="info-text">Hunter ({this.props.hunterName})</span>
          </span>
          <span className="info">
            <span className="info-icon prey"></span>
            <span className="info-text">Prey ({this.props.preyName})</span>
          </span>
          <span className="info">
            <span className="info-icon bomb"></span>
            <span className="info-text">Bomb Left: { this.props.numBombs } </span>
          </span>
          <span className="info">
            <span className="info-text">Moves made: { this.props.numMoves } </span>
          </span>
          <span className="info">
            <span className="info-text">To Play: {this.props.nameToPlay}</span>
          </span>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', height: '100%', width: '100%'}}>
          <canvas
            ref={(canvas) => { this.canvas = canvas; }}
            onClick={this.makeMove}
          >
          </canvas>
        </div>
        <button
          onClick={this.props.placeBomb}
          disabled={!(this.props.huntersTurn && this.props.numBombs > 0 && !this.props.graph[this.props.hunterX][this.props.hunterY].hasBomb)}
        >Place Bomb</button>
        <button
          onClick={this.props.pickupBomb}
          disabled={!(this.props.huntersTurn && this.props.graph[this.props.hunterX][this.props.hunterY].hasBomb)}
        >Pickup Bomb</button>
      </div>
    )
  }
}

export default BoardCanvas;
