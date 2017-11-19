import React, { Component } from 'react';
import Select from '../Select';
import {
  CHARITIES,
  DEFAULT_CHARITY,
  PRODUCT,
} from '../../helpers/constants';
import './style.scss';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      charity: DEFAULT_CHARITY,
      isMining: true,
      statusInterval: null,
    };
  }

  componentDidMount() {
    this.startLoop();
  }

  componentWillUnmount() {
    this.stopLoop();
  }

  update = () => {
    chrome.runtime.sendMessage({ type: 'GET_MINER_STATUS' }, (response) => {
      const { isMining } = response;
      this.setState({ isMining });
    });
    chrome.runtime.sendMessage({ type: 'GET_MINING_CHARITY' }, (response) => {
      const { charity } = response;
      const charityObj = CHARITIES.find(x => x.value === charity) || DEFAULT_CHARITY;
      this.setState({
        charity: charityObj,
      });
    });
  }

  startLoop = () => {
    const statusInterval = setInterval(this.update, 1000);
    this.setState({ statusInterval });
  }

  stopLoop = () => {
    const { statusInterval } = this.state
    clearInterval(statusInterval);
    this.setState({
      statusInterval: null,
    });
  }

  toggleMining = () => {
    chrome.runtime.sendMessage({ type: 'TOGGLE_MINING' }, (response) => {
      const { isMining } = response;
      this.setState({ isMining });
    });
  }

  changeCharity = (charity) => {
    chrome.runtime.sendMessage({
      type: 'SET_MINING_CHARITY',
      charity,
    });
    this.setState({ charity });
  }

  render() {

    const {
      charity,
      isMining,
    } = this.state;

    return (
      <div
        styleName="container"
      >
        <span
          styleName="product"
        >
          {PRODUCT.NAME}
        </span>
        <button
          onClick={this.toggleMining}
        >
          Toggle Mining
        </button>
        <Select
          value={charity.value}
          options={CHARITIES}
          onChange={this.changeCharity}
          clearable={false}
        />
      </div>
    )
  }
};
