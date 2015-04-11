define(['jquery', 'ui', 'css!styles/control.css'], function ($) {
    var uid = 0;

    $.widget('nova.Control', {
        options: {
            type: 'control'
        },
        _uuid: function () {
            return [
                'ctrl',
                this.options.type,
                (+new Date()).toString(36),
                ++uid
            ].join('-');
        },
        _create: function () {
            this.element
                .data('uuid', this._uuid())
                .addClass('control')
                .append('<div class="control-mask"></div>')
                .resizable({
                    helper: "ui-resizable-helper",
                    handles: "n, e, s, w, ne, se, sw, nw" //八个方向均可拖拽缩放
                })
                .draggable()
                .resizable('disable');
        },
        _destory: function () {
            //todo
        },
        select: function () {
            this.element
                .addClass('control-selected')
                .resizable('enable');
        },
        deselect: function () {
            this.element
                .removeClass('control-selected')
                .resizable('disable');
        }
    });

    //公共函数都是使用dom作为接口
    $.nova.Control.findControl = function (dom) {
        return $(dom).closest('.control').get(0);
    };
    $.nova.Control.all = function () {
        return $('.control');
    };
    $.nova.Control.equal = function (domA, domB) {
        return $(domA).data('uuid') === $(domB).data('uuid');
    };
});