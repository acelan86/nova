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

            this.renderContent();
        },
        _init: function () {
            //doshome
        },
        _destory: function () {
            //todo
        },
        renderContent: function (data) {
            var tpl = $.nova.Control.getControlTpl(this.options.type);
            data = $.extend(this.options.data, data || {})
            this.element.html(tpl(data));
        }
    });

    //获取模板
    $.nova.Control.getControlTpl = function (type) {
        var tpl;
        if (!(tpl = tplCache[type])) {
            tpl = handlebars.compile($('#tpl-ctrl-' + type).text());
            tplCache[type] = tpl;
        }
        return tpl;
    };

    //公共函数都是使用dom作为接口
    $.nova.Control.findControl = function (dom) {
        return $(dom).closest('.control').get(0);
    };
});