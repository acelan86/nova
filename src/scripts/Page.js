define(['jquery', 'jqueryui'], function ($) {
    $.widget('nova.Page', {
        options: {
        },
        _create: function () {
            this.foreground = null; //前景
            this.background = null; //背景
        }

    }); 
});