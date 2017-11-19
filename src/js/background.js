/* global CoinHive:true navigator:true */

import { wrapStore } from 'react-chrome-redux';
import {
  COINHIVE,
  DEFAULT_CHARITY,
  ICONS,
  REACT_CHROME_REDUX,
} from './helpers/constants';
import { state as stateActions } from './actions';
import store from './store/index';

wrapStore(store, {
  portName: REACT_CHROME_REDUX.PORT_NAME,
});

const {
  dispatch,
} = store;

let miner;

const icons = {
  default: ICONS.DARK,
  mining: ICONS.BRIGHT,
};

const setIcon = (iconPath) => {
  chrome.browserAction.setIcon({
    path: iconPath,
  });
};

// Make sure default icon is set
setIcon(icons.default);

const toggleMining = () => {
  if (!miner) return;
  miner.isRunning() ? miner.stop() : miner.start();
  return miner.isRunning();
}

const setMinerUser = (user) => {
  if (miner && Object.hasOwnProperty.call(miner, 'stop')) {
    miner.stop();
  }
  miner = new CoinHive.User(COINHIVE.KEY, user);
  miner.start();
}

if (!localStorage.getItem('charity')) {
  localStorage.setItem('charity', DEFAULT_CHARITY.value);
}

if (CoinHive) {
  const throttles = {
    active: 0.95,
    idle: 0.5,
    locked: 0.2,
  };

  miner = new CoinHive.User(COINHIVE.KEY, localStorage.getItem('charity'));

  miner.setThrottle(throttles.active);
  miner.start();

  const checkCoinHiveStatus = () => {
    if (!miner.isRunning()) {
      miner.start();
    }
  };

  let statusLoop;
  const startLoop = () => {
    statusLoop = setInterval(checkCoinHiveStatus, 30000);
  };

  const stopLoop = () => {
    if (!statusLoop) return;
    statusLoop = clearInterval(statusLoop);
  };

  miner.on('open', () => {
    setIcon(icons.mining);
    chrome.runtime.sendMessage({ type: 'MINER_STARTED' });
    startLoop();
  });
  miner.on('close', () => {
    setIcon(icons.default);
    chrome.runtime.sendMessage({ type: 'MINER_STOPPED' });
    stopLoop();
  });

  // If the battery is not charging, stop mining
  const checkBattery = battery => (
    battery.charging ? miner.start() : miner.stop()
  );

  // If we've got the battery API then use it
  if (typeof navigator.getBattery === 'function') {
    navigator.getBattery().then((battery) => {
      checkBattery(battery);
      battery.addEventListener('chargingchange', () => {
        checkBattery(battery);
      });
    });
  } else {
    miner.start();
  }

  const startIdleChecks = () => {
    const idleDetectionInterval = 300;

    // Initialize throttle and set detection interval
    chrome.idle.queryState(idleDetectionInterval, (newState) => {
      // Set appropriate throttle level
      miner.setThrottle(throttles[newState]);
    });

    chrome.idle.setDetectionInterval(idleDetectionInterval);

    chrome.idle.onStateChanged.addListener((newState) => {
      // Set appropriate throttle level
      miner.setThrottle(throttles[newState]);
    });
  };

  if (chrome.idle && typeof chrome.idle.queryState === 'function') {
    startIdleChecks();
  } else {
    miner.setThrottle(0.90);
  }

  // To be used from inspector
  window.getMiner = () => miner;
} else {
  console.error('CoinHive is not defined');
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { type } = request;
  if (type === 'CLEAR_STATE') {
    dispatch(stateActions.clear());
    sendResponse({ ok: true });
  } else if (type === 'GET_MINER_STATUS') {
    const isMining = miner.isRunning();
    sendResponse({ isMining });
  } else if (type === 'TOGGLE_MINING') {
    const isMining = toggleMining();
    sendResponse({ isMining });
  } else if (type === 'GET_MINING_CHARITY') {
    const charity = localStorage.getItem('charity');
    sendResponse({ charity });
  } else if (type === 'SET_MINING_CHARITY') {
    const charity = request.charity.value;
    localStorage.setItem('charity', charity);
    setMinerUser(charity);
  }
});