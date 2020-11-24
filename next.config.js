const withWorkers = require('@zeit/next-workers');
module.exports = withWorkers({
    workerLoaderOptions: { inline: 'no-fallback' },
    webpack: (config) => {
        return config;
    },
})