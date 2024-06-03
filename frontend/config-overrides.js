const Dotenv = require('dotenv-webpack');

module.exports = function override(config, env) {
    config.plugins = (config.plugins || []).concat([
        new Dotenv({
            path: './.env', // Path to .env file (this is the default)
            safe: false, // Load .env.example (defaults to "false" which does not use dotenv-safe)
            systemvars: true // Load all system variables as well (useful for CI purposes)
        })
    ]);

    return config;
};
