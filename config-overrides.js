module.exports = {
    webpack: function (config, env) {
        config.module.rules.push({
            test: require('path').resolve(__dirname, 'node_modules/leader-line/'),
            use: [
                {
                    loader: 'skeleton-loader',
                    options: {
                        procedure: (content) => `${content}export default LeaderLine`,
                    },
                },
            ],
        });

        return config;
    },
};
