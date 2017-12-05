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
    const scale = 0.9;
    this.basePX = Math.floor(scale * window.innerWidth / (this.dimension * 3));
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
        <header>
          <h1>Graph Evasion</h1>
          <h2>
            There are two players, a hunter and a prey. The hunter's objective is to capture the prey (capture means being on the same node) in as few moves as possible, whereas the prey's objective is to avoid the hunter for as many moves as possible. During their turn, both the hunter and the prey can move to an adjacent node in the graph. However, the hunter also has the option of leaving a bomb at its location before moving to a new node. If a prey steps on a bomb, the game ends immediately. Note that although the number of bombs available is limited, the hunter may go back to where it placed the bomb to pick it up (bombs not affect the hunter).
          </h2>
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
              <span className="info-text">To Play: {this.props.nameToPlay}</span>
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
