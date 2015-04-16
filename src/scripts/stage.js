define(['require', 'jquery', 'ui', 'scripts/controls/Control'], function (require, $) {
    //扩展获取实例接口
    $.fn.extend({
        instance: function () {
            var widgetName = this.data('widgetName');
            return widgetName ? this.data(widgetName) : null;
        }
    });

    //扩展键值
    $.extend($.ui.keyCode, {
        OPT     : 18,
        DEL     : 46,
        A       : 65,
        Z       : 90,
        G       : 71,
        I       : 73,
        P       : 80,
        C       : 67,
        V       : 86
    });

    /**
     * 列表管理
     */
    function ControlSelections() {
        this.list = [];
    }
    ControlSelections.prototype = {
        equal: function ($a, $b) {
            return $a.get(0) === $b.get(0);
        }, 
        has: function (obj) {
            var me = this
            var found = false;
            $.each(this.list, function (i, item) {
                if (me.equal(obj, item)) {
                    found = true;
                    return false;
                }
            });
            return found;
        },
        add: function (obj) {
            if (!this.has(obj)) {
                this.list.push($(obj));
            }
            return this.list;
        },
        remove: function (obj) {
            var me = this;
            $.each(this.list, function (i, item) {
                if (me.equal(obj, item)) {
                    me.list.splice(i, 1);
                    return false;
                }
            });
            return this.list;
        },
        clear: function () {
            return this.list = [];
        },
        get: function () {
            return this.list;
        }
    };


    //Control shortcut
    var Control = $.nova.Control;

    $.widget('ui.stage', $.ui.mouse, {
        options : {
            filter: '.control',
            tolerance : 'touch'
        },
        _create: function () {
            var me = this;
            //创建辅助选择节点，用于形成选择区域框
            this.helper = $('<div class="stage-helper"></div>');
            //选中项管理器
            this.selections = new ControlSelections();
            //存储相关布局
            this._cacheLayout();

            //将所有ctrl, html变成可以编辑的控件
            this.element.find('.control')
                .each(function () {
                    var $ctrl = $(this);
                    me.enhanceControl($ctrl);
                });

            //取消默认鼠标选中文字功能
            this.element.disableSelection();

            //初始化鼠标事件
            this._mouseInit();

            this._on(this.element, {
                'dragstart      .control-mask'  : this._dragStart,
                'drag           .control-mask'  : this._drag,
                'dragstop       .control-mask'  : this._dragStop,
                'resizestart    .control-mask'  : this._resizeStart,
                'resizestop     .control-mask'  : this._resizeStop,
                'mouseup'                       : this._onMouseUp
            });

            //resize
            this._on($(window), {
                'resize': this._windowResize
            });

            //键盘控制控件移动
            this._on($(document), {
                'keydown': this._key
            });
        },
        //缓存所有控件信息
        _cache : function() {
            var filter = this.options.filter;
            $(filter).each(function() {
                var $item = $(this);
                var pos = $item.offset();
                $item.data("cache-info", {
                    left    : pos.left,
                    top     : pos.top,
                    right   : pos.left + $item.outerWidth(),
                    bottom  : pos.top  + $item.outerHeight()
                });
            });
        },
        _cacheLayout: function () {
            this.canvasOffset = this.element.find('.canvas').offset();
            this.stageOffset = this.element.offset();
        },
        _dragStart: function (e, ui) {
            this._off(this.element, "mouseup");
            var $ctrl = $(e.target).data('control');
            //设置control的长宽
            $ctrl
                .css({
                    width   : $(e.target).width(),
                    height  : $(e.target).height()
                });

            //如果原来未选中, 那么选中自己，清除别人
            if (!this.selections.has($ctrl)) {
                this.singleSelectControl($ctrl);
            }

            this.selections.get().map(function ($item) {
                $item.data({
                    'oleft': parseInt($item.css('left'), 10) || 0,
                    'otop': parseInt($item.css('top'), 10) || 0
                });
            });
        },
        _drag: function (e, ui) {
            var me = this;
            var $ctrl = $(e.target).data('control');

            //移动偏移量
            var offset = {
                x: ui.offset.left - ui.originalPosition.left - this.stageOffset.left,
                y: ui.offset.top - ui.originalPosition.top - this.stageOffset.top
            };

            if (this.selections.has($ctrl)) {
                //同步移动
                this.selections.get().map(function ($item) {
                    //移动ctrl
                    $item
                        .css({
                            left: offset.x + $item.data('oleft'),
                            top : offset.y + $item.data('otop')
                        });
                    //移动mask
                    $item.data('mask')
                        .css({
                            left: offset.x + $item.data('oleft') + me.canvasOffset.left - me.stageOffset.left,
                            top : offset.y + $item.data('otop') + me.canvasOffset.top - me.stageOffset.top
                        });
                });
            }
        },
        _dragStop: function (e, ui) {
            this._on(this.element, {
                "mouseup": this._onMouseUp
            });
        },
        _resizeStart: function (e) {
            this._off(this.element, "mouseup");
        },
        _resizeStop: function (e, ui) {
            $(e.target).data('control')
                .css({
                    width   : ui.size.width,
                    height  : ui.size.height,
                    left    : ui.position.left - this.canvasOffset.left,
                    top     : ui.position.top  - this.canvasOffset.top
                });
            this._on(this.element, {
                "mouseup": this._onMouseUp
            });
        },
        _mouseStart : function (e) {
            this.opos = [e.pageX, e.pageY];
            $('body').append(this.helper);

            this.helper.css({
                left: e.clientX,
                top: e.clientY,
                width: 0,
                height: 0
            });
            this._cache();

            this._off(this.element, "mouseup");
        },
        _mouseDrag : function (e) {
            var me = this;
            var options = this.options;

            this.dragged = true;

            var x1 = this.opos[0], y1 = this.opos[1], x2 = e.pageX, y2 = e.pageY;
            if (x1 > x2) {
                var tmp = x2; x2 = x1; x1 = tmp;
            }
            if (y1 > y2) {
                var tmp = y2; y2 = y1; y1 = tmp;
            }
            this.helper.css({
                left : x1,
                top : y1,
                width : x2 - x1,
                height : y2 - y1
            });

            this.element.find('.control').each(function () {
                var $item = $(this),
                    cache = $item.data("cache-info"),
                    hit = false;

                if (!cache) {
                    return;
                }

                if (options.tolerance == 'touch') {
                    hit = (!(cache.left > x2 || cache.right < x1 || cache.top > y2 || cache.bottom < y1));
                } else if (options.tolerance == 'fit') {
                    hit = (cache.left > x1 && cache.right < x2 && cache.top > y1 && cache.bottom < y2);
                }

                if (hit) {
                    me.selectControl($item);
                } else {
                    me.deselectControl($item);
                }
            });

            return false;
        },
        _onMouseUp: function (e) {
            //根据e.target查找他对应的control，如果点击的是mask，那么从data-control中获取
            var control = $(e.target).data('control') || Control.findControl(e.target),
                $control;
            //点中的是非控件, 取消当前选中, 并且触发选中空白区域事件，这时候应该展现对页过渡效果设置
            if (!control) {
                this.clearSelectControl();
                //触发点中空白区域事件
                this._postMessage(e);
            //点中控件，选中控件逻辑
            } else {
                //情况一， 点击控件，触发选中控件逻辑
                $control = $(control);
                if (e.metaKey || e.ctrlKey) {
                    if (this.selections.has($control)) {
                        this.deselectControl($control);
                    } else {
                        this.selectControl($control);
                    }
                    this._postMessage(e);
                } else {
                    //当原来不是选中情况下才触发
                    if (!this.singleSelectControl($control)) {
                        this._postMessage(e);
                    }
                }
            }
        },
        _mouseStop : function (e) {
            this.dragged = false;
            this.helper.remove();

            this._on(this.element, {
                "mouseup": this._onMouseUp
            });

            //情况三， 全局框选，触发选中控件
            this._postMessage(e);
            return false;
        },
        //resize 时重新定位select mask
        _windowResize: function () {
            this._cacheLayout();
            this.element.find('.control').each(function () {
                var $ctrl = $(this);
                $ctrl.data('mask')
                    .position({
                        my: "left top",
                        at: "left top",
                        of: $ctrl
                    });
            });
        },

        _key: function (e) {
            var step = 1;
            console.log(e.which);
            //阻止浏览器回退键
            if (e.which === $.ui.keyCode.DEL) {
                e.preventDefault();
            } else if (e.which != $.ui.keyCode.BACKSPACE || (e.which == $.ui.keyCode.BACKSPACE && (e.target.nodeName === 'INPUT' || e.target.nodeName === 'TEXTAREA'))) {
                if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.which === $.ui.keyCode.A)) { //全选 command + A
                    e.preventDefault();
                    this.clearSelectControl();
                } else if ((e.metaKey || e.ctrlKey) && (e.which === $.ui.keyCode.A)) { //取消全选command + shift + A
                    e.preventDefault();
                    this.selectAllControl();
                } else if ((e.metaKey || e.ctrlKey) && (e.which === $.ui.keyCode.I)) { //显示隐藏tag command + i
                    e.preventDefault();
                } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.which === $.ui.keyCode.P)) { //预览，编辑 command + shift + p
                    //
                } else if ((e.metaKey || e.ctrlKey) && e.shiftkey && (e.which === $.ui.keyCode.Z)) {
                    e.preventDefault();
                    //recorder.redo();
                } else if ((e.metaKey || e.ctrlKey) && (e.which === $.ui.keyCode.Z)) {
                    e.preventDefault();
                    //recorder.restore();
                } else if ((e.metaKey || e.ctrlKey) && (e.which === $.ui.keyCode.C)) {
                    if (!(e.target.nodeName === 'INPUT' || e.target.nodeName === 'TEXTAREA')) {
                        e.preventDefault();
                        //stageEvent.copySelected(e);
                    }
                } else if ((e.metaKey || e.ctrlKey) && (e.which === $.ui.keyCode.V)) {
                    if (!(e.target.nodeName === 'INPUT' || e.target.nodeName === 'TEXTAREA')) {
                        e.preventDefault();
                        //stageEvent.pasteSelected(e);
                    }
                } else if (e.which === $.ui.keyCode.LEFT) {
                    this.moveSelectControl('left', -step);
                } else if (e.which === $.ui.keyCode.RIGHT) {
                    this.moveSelectControl('left', step);
                } else if (e.which === $.ui.keyCode.UP) {
                    this.moveSelectControl('top', -step);
                } else if (e.which === $.ui.keyCode.DOWN) {
                    this.moveSelectControl('top', step);
                } else if (e.altKey) {
                    this.element.toggleClass('control-mask-border-show');
                }
            } else {
                //删除
                //stageEvent.removeSelected(e);
                e.preventDefault();
            }
        },
        _maskControl: function ($ctrl) {
            var $mask = $('<div class="control-mask"/>')
                .appendTo(this.element)
                .resizable({
                    helper: "ui-resizable-helper",
                    handles: "n, e, s, w, ne, se, sw, nw" //八个方向均可拖拽缩放
                })
                .draggable({
                    containment : this.element,
                })
                //记录他关联的控件
                .data('control', $ctrl)
                .css({
                    width   : $ctrl.width(),
                    height  : $ctrl.height(),
                    zIndex  : (parseInt($ctrl.css('z-index'), 10) || 0) + 1
                })
                .position({
                    my: "left top",
                    at: "left top",
                    of: $ctrl
                })
                .resizable('disable');
            //记录控件关联的遮罩
            $ctrl.data('mask', $mask);
        },
        enhanceControl: function ($ctrl) {
            var me = this;
            var type = $ctrl.data('type');
            switch (type) {
                case 'image':
                    require(['scripts/controls/Image.js'], function () {
                        $ctrl.ImageControl();
                        me._maskControl($ctrl);
                    });
                    break;
                case 'text':
                    require(['scripts/controls/Text.js'], function () {
                        $ctrl.TextControl();
                        me._maskControl($ctrl);
                    });
                    break;
                default:
                    $ctrl.Control();
                    me._maskControl($ctrl);
                    break;
            }
        },
        //发送消息通知，触发事件
        _postMessage: function (e) {
            var selections = this.selections.get();
            if (selections && selections.length > 0) {
                this._trigger('activecontrol', e, {
                    controls: selections
                });
            } else {
                this._trigger('activepage', e, {
                    index: parseInt(this.element.data('i'), 10)
                });
            }
        },
        _selectControlView: function ($ctrl) {
            $ctrl.data('mask')
                .addClass('control-mask-show')
                .resizable('enable');
        },
        _deselectControlView: function ($ctrl) {
            $ctrl.data('mask')
                .removeClass('control-mask-show')
                .resizable('disable');
        },
        selectControl: function ($ctrl) {
            this.selections.add($ctrl);
            this._selectControlView($ctrl);
        },
        deselectControl: function ($ctrl) {
            this.selections.remove($ctrl);
            this._deselectControlView($ctrl);
        },
        clearSelectControl: function () {
            var me = this;
            $.each(this.selections.get(), function (i, $item) {
                me._deselectControlView($item); 
            });
            this.selections.clear();
        },
        singleSelectControl: function ($ctrl) {
            var _has = this.selections.has($ctrl);
            this.clearSelectControl();
            this.selectControl($ctrl);
            //如果原来没有，那么需要触发一次选中事件
            return _has;
        },
        moveSelectControl: function (dir, offset) {
            var me = this;
            $.each(this.selections.get(), function (i, $ctrl) {
                var value = (parseInt($ctrl.css(dir), 10) || 0) + offset;
                $ctrl.css(dir, value);
                $ctrl.data('mask').css(dir, value + me.canvasOffset[dir] - me.stageOffset[dir]);
            });
        },
        selectAllControl: function () {
            var me = this;
            this.element.find('.control').each(function () {
                me.selectControl($(this));
            });
        },
        getSelection: function () {
            return this.selections.get();
        },
        _destroy: function() {
            this._mouseDestroy();
            console.log('page destroy');
            this.element.find('.control').each(function () {
                $(this).data('mask').remove();
                $(this).remove();
            });
        }
    });
});