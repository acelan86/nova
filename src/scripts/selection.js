define(['jquery', 'jqueryui'], function ($) {
    //管理当前选中的列表
    var Selection = (function () {
        var list = [];
        return {
            has: function (control) {
                var found = false;
                $.each(list, function (i, item) {
                    if (item.get(0) === $(control).get(0)) {
                        found = true;
                        return false;
                    }
                });
                return found;
            },
            add: function (control) {
                if (!this.has(control)) {
                    list.push($(control));    
                }
                return list;
            },
            remove: function (control) {
                $.each(list, function (i, item) {
                    if (item.get(0) === $(control).get(0)) {
                        list.splice(i, 1);
                        return false;
                    }
                });
                return list;
            },
            clear: function () {
                return list = [];
            },
            get: function () {
                return list;
            }
        };
    })();

    //debug
    window.Selection = Selection;


    //控件的选中，去除选中dom操作
    var Control = (function () {
        return {
            all: function () {
                return $('.control');
            },
            find: function (dom) {
                return $(dom).closest('.control').get(0);
            },
            select: function (control) {
                $(control)
                    .addClass('control-selected')
                    .resizable('enable');
            },
            deselect: function (control) {
                $(control)
                    .removeClass('control-selected')
                    .resizable('disable');
            }
        }
    })();


    var api = {
        singleSelectControl: function (control) {
            var _has = Selection.has(control);
            Selection.get().map(function (item) {
                Control.deselect(item);
            });
            Selection.clear();
            Control.select(control);
            Selection.add(control);
            //如果原来没有，那么需要触发一次选中事件
            if (!_has) {
                //触发选中某个控件逻辑
            }
        },
        selectControl: function (control) {
            Control.select(control);
            Selection.add(control);
        },
        deselectControl: function (control) {
            Control.deselect(control);
            Selection.remove(control);
        },
        clearSelectControl: function () {
            Selection.get().map(function (item) {
                Control.deselect(item);
            });
            Selection.clear();
        },
        moveSelectControl: function (dir, offset) {
            Selection.get().map(function (item) {
                $(item).css(dir, parseInt($(item).css(dir), 10) + offset);
            });
        }
    };


    $.widget('ui.selection', $.ui.mouse, {
        options : {
            filter: '.control',
            tolerance : 'touch'
        },
        _create: function () {
            this.helper = $('<div class="stage-helper"></div>');

            //初始化control, 使control拥有拖拽和resize属性，并且初始状态是禁用resize的
            $('.control')
                .data('uuid', (+new Date()).toString())
                .append('<div class="control-mask"></div>')
                .resizable({
                    helper : "ui-resizable-helper",
                    //八个方向均可拖拽缩放
                    handles : "n, e, s, w, ne, se, sw, nw"
                })
                .draggable({
                    //containment : this.element
                })
                .resizable('disable');

            //取消默认鼠标选中文字功能
            this.element.disableSelection();

            //初始化鼠标事件
            this._mouseInit();

            this._on(this.element, {
                "mouseup": this._onclick,
                "dragstart .control": function (e, ui) {
                    this._off(this.element, "mouseup");
                    //如果原来未选中, 那么选中自己，清除别人
                    if (!Selection.has(e.target)) {
                        api.singleSelectControl(e.target);
                    }

                    //记录起始坐标
                    Selection.get().map(function ($item) {
                        $item.data({
                            'oleft': parseInt($item.css('left'), 10),
                            'otop': parseInt($item.css('top'), 10)
                        });
                    });

                },
                "drag .control": function (e, ui) {
                    //移动偏移量
                    var offset = {
                        x: ui.offset.left - ui.originalPosition.left,
                        y: ui.offset.top - ui.originalPosition.top
                    };
                    var canvasOffset = $('.canvas').offset();

                    if (Selection.has(e.target)) {
                        //同步移动
                        Selection.get().map(function ($item) {
                            //console.log($item.data('oleft'), $item.data('otop'));
                            $item.css({
                                //ui.offset.left - ui.origin
                                //
                                'left': offset.x + $item.data('oleft') - canvasOffset.left,
                                'top': offset.y + $item.data('otop') - canvasOffset.top
                            });
                        });
                    }
                },
                "dragstop .control": function (e) {
                    this._on(this.element, {
                        "mouseup": this._onclick
                    });
                }
            });

            //键盘控制控件移动
            $(document)
                .on('keydown', function (e) {
                    var step = 1;
                    switch (e.keyCode) {
                        //左移动
                        case $.ui.keyCode.LEFT:
                            api.moveSelectControl('left', -step);
                            break;
                        //右移动
                        case $.ui.keyCode.RIGHT:
                            api.moveSelectControl('left', step);
                            break;
                        //上移动
                        case $.ui.keyCode.UP:
                            api.moveSelectControl('top', -step);
                            break;
                        //下移动
                        case $.ui.keyCode.DOWN:
                            api.moveSelectControl('top', step);
                            break;
                    }
                });
        },
        _onclick: function (e) {
            var control = Control.find(e.target);
            //点中的是非控件, 取消当前选中, 并且触发选中空白区域事件，这时候应该展现对页过渡效果设置
            if (!control) {
                api.clearSelectControl();
                //触发点中空白区域事件
            //点中控件，选中控件逻辑
            } else {
                if (e.metaKey || e.ctrlKey) {
                    if (Selection.has(control)) {
                        api.deselectControl(control);
                    } else {
                        api.selectControl(control);
                    }
                } else {
                    api.singleSelectControl(control);
                }
            }
        },
        //缓存所有控件信息
        _cache : function() {
            var filter = this.options.filter;
            $(filter).each(function() {
                var $item = $(this);
                var pos = $item.offset();
                $item.data("cache-info", {
                    left: pos.left,
                    top: pos.top,
                    right: pos.left + $item.outerWidth(),
                    bottom: pos.top + $item.outerHeight()
                });
            });
        },
        _mouseStart : function (e) {
            this.opos = [e.pageX, e.pageY];
            $('body').append(this.helper);

            //(!e.ctrlKey || !e.shiftKey) && this.unselectAll();

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

            $(options.filter).each(function () {
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
                    api.selectControl($item);
                } else {
                    api.deselectControl($item);
                }
            });

            return false;
        },
        _mouseStop : function (e) {
            this.dragged = false;
            this.helper.remove();
            this._on(this.element, {
                "mouseup": this._onclick
            });
            return false;
        },
        _destroy: function() {
            this._mouseDestroy();
        }
    });
});