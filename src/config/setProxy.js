const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function(app){
    app.use(
        "/api",
        createProxyMiddleware({
            target: "http://localhost:8080",
            changeOrigin: true
        })
    )
    app.use(
        '/api', // 두 번째 프록시 경로
        createProxyMiddleware({
            target: 'http://localhost:8000',
            changeOrigin: true,
        })
    );
};
