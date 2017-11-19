import React from 'react';
import ReactSelect from 'react-select';
import './styles.scss';

export default props => (
  <div styleName="wrap">
    <ReactSelect {...props} />
  </div>
);
