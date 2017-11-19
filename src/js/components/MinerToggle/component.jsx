import React, { Component } from 'react';
import './style.scss';

export default class MinerToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMining: true,
    };
  }

  componentDidMount() {
    this.startLoop();
  }

  componentWillUnmount() {
    this.stopLoop();
  }

  getMinerStatus = () => {
    chrome.runtime.sendMessage({ type: 'GET_MINER_STATUS' }, (response) => {
      const { isMining } = response;
      this.setState({ isMining });
    });
  }

  startLoop = () => {
    const { getMinerStatus } = this;
    getMinerStatus();
    const updateLoop = setInterval(getMinerStatus, 1000);
    this.setState({ updateLoop });
  }

  stopLoop = () => {
    const { updateLoop } = this.state;
    clearInterval(updateLoop);
    this.setState({
      updateLoop: null,
    });
  }

  toggleMining = () => {
    chrome.runtime.sendMessage({ type: 'TOGGLE_MINING' }, (response) => {
      const { isMining } = response;
      this.setState({ isMining });
    });
  }

  render() {
    const {
      isMining,
    } = this.state;

    return (
      <button
        onClick={this.toggleMining}
      >
        {isMining ? 'Stop mining' : 'Start mining'}
      </button>

    );
  }
}
