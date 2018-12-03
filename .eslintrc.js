module.exports = {
  "extends": ["airbnb", "tslint-config-airbnb", "tslint-eslint-rules"],
  "rules": {
    // enable additional rules
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "semi": ["error", "always"],

    // override default options for rules from base configurations
    "no-cond-assign": ["error", "always"],
    "no-constant-condition": true,
    // disable rules from base configurations
    "no-console": "off",
  }
}