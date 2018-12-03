module.exports = {
  "extends": "airbnb",
  "rules": {
    // enable additional rules
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "semi": ["error", "always"],
    // override default options for rules from base configurations
    "no-cond-assign": ["error", "always"],
    // disable rules from base configurations
    "no-console": "off",
  }
}