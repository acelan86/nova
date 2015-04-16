define(['jquery', 'handlebars', 'ui', 'scripts/controls/Control.js'], function ($, handlebars) {
    var Control = $.nova.Control;

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



    $.widget('nova.PageViewController', $.ui.mouse, {
        _create: function () {
            var me = this;

            this._mouseInit();

            //选中项
            this.selections = new ControlSelections();

            this.pageOffset = this.element.offset();

            this.element
                .addClass('page-editable');

            //将所有ctrl, html变成可以编辑的控件
            this.element.find('.control')
                .each(function () {
                    var $ctrl = $(this);
                    me.enhanceControl($ctrl);
                });

            this._on($('body'), {
                'dragstart .control-mask': function (e, ui) {
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
                'drag .control-mask': function (e, ui) {
                    var me = this;
                    var $ctrl = $(e.target).data('control');

                    //移动偏移量
                    var offset = {
                        x: ui.offset.left - ui.originalPosition.left,
                        y: ui.offset.top - ui.originalPosition.top
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
                                    left: offset.x + $item.data('oleft') + me.pageOffset.left,
                                    top : offset.y + $item.data('otop') + me.pageOffset.top
                                });
                        });
                    }
                },
                'resizestop .control-mask': function (e, ui) {
                    $(e.target).data('control')
                        .css({
                            width   : ui.size.width,
                            height  : ui.size.height,
                            left    : ui.position.left - this.pageOffset.left,
                            top     : ui.position.top - this.pageOffset.top
                        });
                },
                'mouseup': function (e) {
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
                        $control = $(control);
                        if (e.metaKey || e.ctrlKey) {
                            if (this.selections.has($control)) {
                                this.deselectControl($control);
                            } else {
                                this.selectControl($control);
                            }
                        } else {
                            this.singleSelectControl($control);
                        }
                        //情况一， 点击控件，触发选中控件逻辑
                        this._postMessage(e);
                    }
                }
            });

            this._on($(window), {
                'resize': this._windowResizeHandle
            });
        },
        //resize 时重新定位select mask
        _windowResizeHandle: function () {
            this.pageOffset = this.element.offset();
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
        _maskControl: function ($ctrl) {
            var $mask = $('<div class="control-mask"/>')
                .appendTo('body')
                .resizable({
                    helper: "ui-resizable-helper",
                    handles: "n, e, s, w, ne, se, sw, nw" //八个方向均可拖拽缩放
                })
                .draggable()
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
        _destroy: function () {
            console.log('page destroy');
            this.element.find('.control').each(function () {
                $(this).data('mask').remove();
                $(this).remove();
            });
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
        selectControl: function ($ctrl) {
            this.selections.add($ctrl);
            this._selectControlView($ctrl);
        },
        _deselectControlView: function ($ctrl) {
            $ctrl.data('mask')
                .removeClass('control-mask-show')
                .resizable('disable');
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
            if (!_has) {
                //触发选中某个控件逻辑
            }
        }
    });
});