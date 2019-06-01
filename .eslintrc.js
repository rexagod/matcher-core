module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "google",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 10
    },
    "rules": {
        'eol-last': 'warn',
        'require-jsdoc': 'off',
        'one-var': 'off',
        'max-len': 'off',
        'new-cap': 'off',
        'no-invalid-this': 'off'
    }
};
