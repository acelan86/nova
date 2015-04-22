define(['jquery', 'handlebars', 'ui', 'css!styles/control.css'], function ($, handlebars) {
    var uid = 0;
    var tplCache = {};

    $.widget('nova.Control', {
        options: {
            type: 'control',
            data: {
                text: 'control'
            }
        },
        _create: function () {
            this.element
                .data('widgetName', this.widgetFullName)
                .addClass('control');

            this.enhance();
        },
        _init: function () {
            //doshome
        },
        _destory: function () {
            //todo
        },
        enhance: function (data) {
            //增强，增加编辑功能
        }
    });

    //公共函数都是使用dom作为接口
    $.nova.Control.findControl = function (dom) {
        return $(dom).closest('.control').get(0);
    };
});