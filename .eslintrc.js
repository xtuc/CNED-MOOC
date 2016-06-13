module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "no-undef": 1,
        "linebreak-style": [
            2,
            "unix"
        ],
        "quotes": [
            2,
            "double"
        ],
        "semi": [
            2,
            "never"
        ],
        "strict": 2
    }
};
