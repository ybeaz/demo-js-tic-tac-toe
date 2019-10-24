module.exports = {
  "extends": [
    "airbnb",
    "plugin:react/recommended"
  ],
  "plugins": [
    "eslint-plugin-jsx-a11y"
  ],
	"parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": { "jsx": true, "js": true, "tsx": true, "ts": true }
  },
  "rules": {
    "valid-jsdoc": 0,
    "require-jsdoc": 0,
    "no-invalid-this": 0, 
    "semi": ["error", "never"],
    "arrow-parens": ["error", "as-needed"],
    "jsx-quotes": ["error", "prefer-single"],
    "quote-props": "off",
    "quotes": ["error", "single"],
    "no-lone-blocks": "off",
    "brace-style": [2, "stroustrup", { "allowSingleLine": true }],
    "padded-blocks": ["error", "never"],
    "linebreak-style": 0,
    "global-require": 0,
    "eslint linebreak-style": [0, "error", "windows"],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".ts", "tsx"] }],
  },
  "env": {
    "browser": true,
    "node": true,
    'jest': true,
  },
  'rules': {
    'no-use-before-define': 'off',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    'comma-dangle': 'off'
  },
  'globals': {
    "fetch": false
  }
};


/*
  "rules": {
    "valid-jsdoc": 'off',
    "require-jsdoc": 'off',
    
    "extends": "airbnb"
    "extends": "google"
    "eslint:recommended"
*/