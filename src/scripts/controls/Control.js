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
            data = $.extend(this.options.data, data || {});
            this.element.html(tpl(data));
        }
    });

    //创建动画style
    $.nova.Control.getAnimationStyle = function (animates, uid) {
        var className = 'custom-animate-' + uid;
        animates = animates || {};
        var baseDelay = 0;
        var names = [];
        var delays = [];
        var durations = [];
        var styles = [];
        var css = [];
        //
        //entrance
        $.each(['entrance', 'attention', 'exit'], function (i, type) {
            var max = 0;
            $.each(animates[type] || [], function (i, animate) {
                var name = animate.name;
                var duration = animate.duration || 0;
                var delay = (animate.delay || 0);
                if (delay + duration > max) {
                    max = delay + duration;
                }
                delay += baseDelay;
                names.push(name);
                durations.push(duration + 's');
                delays.push(delay + 's');
            });
            baseDelay += max;
        });

        names = names.join(',');
        delays = delays.join(',');
        durations = durations.join(',');

        if (names) {
            styles.push('-webkit-animation-name:' + names);
        }

        if (durations) {
            css.push('-webkit-animation-duration:' + durations);
        }
        if (delays) {
            css.push('-webkit-animation-delay:' + delays);
        }
        
        return {
            className   : className,
            style       : styles.join(';'),
            css         : '.animated .' + className + '{' + css.join(';') + '}'
        };
    };

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