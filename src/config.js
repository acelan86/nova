/**
 * require全局配置项
 */
requirejs.config({
    baseUrl: "./",
    paths: {
        jquery: "lib/jquery/dist/jquery",
        ui: "lib/jqueryui/jquery-ui",
        jqmousewheel: "lib/jquery-mousewheel/jquery.mousewheel",
        handlebars: "lib/handlebars/handlebars"
    },
    shim: {
        jquery : {
            exports: "$"
        },
        handlebars: {
            exports: "Handlebars"
        }
    },
    map: {
        "*": {
            css: "lib/require-css/css",
            text: "lib/text/text"
        }
    }
});
