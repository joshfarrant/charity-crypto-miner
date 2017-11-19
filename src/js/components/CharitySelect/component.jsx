import React, { Component } from 'react';
import Select from '../Select';
import {
  CHARITIES,
  DEFAULT_CHARITY,
} from '../../helpers/constants';
import './style.scss';

export default class CharitySelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charity: DEFAULT_CHARITY,
      updateLoop: null,
    };
  }

  componentDidMount() {
    this.startLoop();
  }

  componentWillUnmount() {
    this.stopLoop();
  }

  getMiningCharity = () => {
    chrome.runtime.sendMessage({ type: 'GET_MINING_CHARITY' }, (response) => {
      const { charity } = response;
      const charityObj = CHARITIES.find(x => x.value === charity) || DEFAULT_CHARITY;
      this.setState({
        charity: charityObj,
      });
    });
  }

  startLoop = () => {
    const { getMiningCharity } = this;
    getMiningCharity();
    const updateLoop = setInterval(getMiningCharity, 1000);
    this.setState({ updateLoop });
  }

  stopLoop = () => {
    const { updateLoop } = this.state;
    clearInterval(updateLoop);
    this.setState({
      updateLoop: null,
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
    } = this.state;

    return (
      <Select
        value={charity.value}
        options={CHARITIES}
        onChange={this.changeCharity}
        clearable={false}
      />
    );
  }
}
