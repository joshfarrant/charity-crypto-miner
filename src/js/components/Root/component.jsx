import React from 'react';
import App from '../App';
import './style.scss';

const Root = () => (
  <div
    styleName="base-theme"
  >
    <div styleName="ocean">
      <div styleName="wave" />
      <div styleName="wave" />
    </div>
    <App />
  </div>
);

export default Root;
