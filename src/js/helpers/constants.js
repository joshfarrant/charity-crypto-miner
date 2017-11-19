export const ENVIRONMENT = {
  PRODUCTION: process.env.NODE_ENV === 'production',
  DEVELOPMENT: process.env.NODE_ENV === 'development',
  TESTING: process.env.NODE_ENV === 'testing',
};

export const CHARITIES = [
  {
    value: 'cystic-fibrosis-trust',
    label: 'Cystic Fibrosis Trust',
  }, {
    value: 'cancer-research-uk',
    label: 'Cancer Research UK',
  }, {
    value: 'british-heart-foundation',
    label: 'British Heart Foundation',
  },
];

export const DEFAULT_CHARITY = CHARITIES[0];

export const COINHIVE = {
  DEV_KEY: 'MDdqOmiuWp7A8trrbJ6FAU9vLIUfIl9k',
  PROD_KEY: '8RFcSByW7dVF3vKnKk58gkM5I5shRCcP',
  get KEY() {
    return ENVIRONMENT.PRODUCTION
      ? COINHIVE.PROD_KEY
      : COINHIVE.DEV_KEY;
  },
};

export const ICONS = {
  DARK: 'assets/heart-full-dark-128.png',
  BRIGHT: 'assets/heart-full-bright-128.png',
};

export const PRODUCT = {
  NAME: 'Project Badger',
};
