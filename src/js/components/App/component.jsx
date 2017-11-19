import React, { Component } from 'react';
import CharitySelect from '../CharitySelect';
import Header from '../Header';
import MinerToggle from '../MinerToggle';
import WaveyTotal from '../WaveyTotal';
import './style.scss';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      statusInterval: null,
      totalRaised: '',
    };
  }

  componentDidMount() {
    this.startLoop();
  }

  componentWillUnmount() {
    this.stopLoop();
  }

  fetchData = () => {
    // TODO Actually fetch data
    this.setState({
      totalRaised: '169',
    });
  }

  startLoop = () => {
    const { fetchData } = this;
    fetchData();
    const statusInterval = setInterval(fetchData, 1000);
    this.setState({ statusInterval });
  }

  stopLoop = () => {
    const { statusInterval } = this.state;
    clearInterval(statusInterval);
    this.setState({
      statusInterval: null,
    });
  }

  render() {
    const {
      totalRaised,
    } = this.state;

    return (
      <div styleName="container">
        <div styleName="top">
          <Header />
        </div>

        <div styleName="middle">
          <MinerToggle />
          <CharitySelect />
        </div>

        <div styleName="bottom">
          <WaveyTotal
            total={`£${totalRaised}`}
            message="Raised in total"
          />
        </div>
      </div>
    );
  }
}
