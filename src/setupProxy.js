/**
 * Created by Administrator on 2019/5/23.
 */
const proxy = require('http-proxy-middleware');
module.exports = function (app) {
/*    app.use(
        proxy("/v2/", {
            target: "http://www.testapp.com",
            changeOrigin: true
        })
    );*/
    app.use(
        proxy("/v1/", {
            secure: false,
            target: "http://47.107.50.5:8080",
            changeOrigin: true
        })
    );
};