/**
 * require全局配置项
 */
requirejs.config({
    baseUrl: "./",
    paths: {
        jquery: "lib/jquery/dist/jquery",
        jqueryui: "lib/jqueryui/jquery-ui",
        jqmousewheel: "lib/jquery-mousewheel/jquery.mousewheel"
    },
    shim: {
        jquery : {
            exports: "$"
        }
    },
    map: {
        "*": {
            css: "lib/require-css/css"
        }
    }
});
