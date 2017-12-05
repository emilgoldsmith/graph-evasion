import React, { Component } from 'react';

class Initialize extends Component {
  constructor() {
    super();
    this.state = {
      player1Name: 'Alice',
      player2Name: 'Bob',
      numCols: 10,
      minRows: 3,
      maxRows: 7,
      numBombs: 10,
    };
  }

  handlePlayer1NameChange = e => {e.preventDefault(); this.setState({player1Name: e.target.value});};
  handlePlayer2NameChange = e => {e.preventDefault(); this.setState({player2Name: e.target.value});};
  handleNumColsChange = e => {e.preventDefault(); this.setState({numCols: e.target.value});};
  handleMinRowsChange = e => {e.preventDefault(); this.setState({minRows: e.target.value});};
  handleMaxRowsChange = e => {e.preventDefault(); this.setState({maxRows: e.target.value});};
  handleNumBombsChange = e => {e.preventDefault(); this.setState({numBombs: e.target.value});};

  render() {
    return (
      <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={this.props.initialize}>
        Player 1 Name:
        <input
          type="text"
          name="player1Name"
          value={this.state.player1Name}
          onChange={this.handlePlayer1NameChange}
        />
        Player 2 Name:
        <input
          type="text"
          name="player2Name"
          value={this.state.player2Name}
          onChange={this.handlePlayer2NameChange}
        />
        Number of Bombs for hunter
        <input
          type="number"
          name="numBombs"
          value={this.state.numBombs}
          onChange={this.handleNumBombsChange}
        />
        Number of columns in graph:
        <input
          type="number"
          name="numCols"
          value={this.state.numCols}
          onChange={this.handleNumColsChange}
        />
        Minium number of rows in each column:
        <input
          type="number"
          name="minRows"
          value={this.state.minRows}
          onChange={this.handleMinRowsChange}
        />
        Maximum number of rows in each column:
        <input
          type="number"
          name="maxRows"
          value={this.state.maxRows}
          onChange={this.handleMaxRowsChange}
        />
        <input type="submit" value="Start Game" />
      </form>
    );
  }
}

export default Initialize;
