import React from 'react';
import PropTypes from 'prop-types';
import Wave from '../Wave';
import './style.scss';

const WaveyTotal = ({
  message,
  total,
}) => (
  <div styleName="container">
    <Wave />
    <div styleName="wrapper">
      <div styleName="text">
        <span styleName="total">{total}</span>
        <span>{message}</span>
      </div>
      <div styleName="color" />
    </div>
  </div>
);

WaveyTotal.propTypes = {
  message: PropTypes.string.isRequired,
  total: PropTypes.string.isRequired,
};

export default WaveyTotal;
