const path = require('path');

module.exports = function (context, options) {
    return {
        name: 'docusaurus-plugin-proxy',
        configureWebpack(config, isServer) {
            if (isServer) return {};
            return {
                devServer: {
                    proxy: [
                        {
                            context: ['/rechnix_api'],
                            target: 'http://localhost:3002',
                            secure: false,
                            changeOrigin: true,
                            // Fix for some cookie issues if backend sets cookie on localhost:3002
                            cookieDomainRewrite: "localhost",
                        }
                    ]
                }
            };
        },
    };
};
