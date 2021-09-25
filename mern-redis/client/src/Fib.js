import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
  state = {
    values: {},
    index: '',
    seenIndexes: [],
  };

  componentDidMount() {
    this.fetchIndexes();
    this.fetchIndexFibValues();
  }

  async fetchIndexFibValues() {
    const values = await axios.get('/api/indexes/fibvalues');
    this.setState({ values: values.data });
  }

  async fetchIndexes() {
    const seenIndexes = await axios.get('/api/indexes/all');
    this.setState({
      seenIndexes: seenIndexes.data,
    });
  }

  renderValues() {
    const entries = [];
    const { values } = this.state;

    for (let key in values) {
      entries.push(
        <div key={key}>
          The value for index {key} is: {values[key]}
        </div>
      );
    }

    return entries;
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { index } = this.state;

    await axios.post('/api/index', {
      index,
    });

    this.setState({ index: '' });
  };

  renderSeenIndexes() {
    const { seenIndexes } = this.state;
    return seenIndexes.map(({ number }) => number).join(', ');
  }

  render() {
    const { index } = this.state;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter index: </label>
          <input
            value={index}
            onChange={(event) => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
        </form>

        <h3>Indexes Submitted:</h3>
        {this.renderSeenIndexes()}

        <h3>Indexes Values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Fib;
