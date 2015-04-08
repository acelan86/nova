define(['jquery', 'jqmousewheel', 'jqueryui'], function ($) {

    //按键列表
    $.extend($.ui.keyCode, {
        DEL: 46,
        A: 65,
        Z: 90,
        G: 71,
        I: 73,
        P: 80,
        C: 67,
        V: 86
    });

    return {
        run: function () {
            //设置鼠标滑轮缩放画布
            // (function () {
            //     var zoom = parseInt($('.canvas-wrapper').css('zoom') || 1, 10),
            //         max = 3,
            //         min = 1;

            //     $('.canvas').on('mousewheel', function (e) {
            //         if ((zoom < max && e.deltaY < 0) || (zoom > 1 && e.deltaY > 0)) {
            //             zoom = zoom * (e.deltaY < 0 ? 1.05 : 0.95);
            //             zoom = zoom > 3 ? 3 : (zoom <= 1 ? 1 : zoom);
            //             $('.canvas-wrapper').css('zoom', zoom);
            //         }
            //     });
            // })();
            (function () {
                var $active = null;
                $('.thumb-list').on('click', '.item', function (e) {
                    $active && $active.removeClass('item-active');
                    $(this).addClass('item-active');
                    $active = $(this);
                });
            })();


            //选中逻辑
            (function () {
                var $active = null;
                //选中控件，选中的时候为可以resize状态
                function selectControl(control) {
                    if ($active !== $(control)) {
                        deselectControl($active);
                        $active = $(control);

                        $active
                            .addClass('control-selected')
                            .resizable('enable');
                    }
                }
                //取消选中，取消的时候是不可以resize状态
                function deselectControl(control) {
                    $control = $(control);
                    $control.removeClass('control-selected');
                    $control.resizable('disable');
                    $active = null;
                }

                //初始化control, 使control拥有拖拽和resize属性，并且初始状态是禁用resize的
                $('.control')
                    .draggable()
                    .resizable({
                        helper : "ui-resizable-helper",
                        //八个方向均可拖拽缩放
                        handles : "n, e, s, w, ne, se, sw, nw"
                    })
                    .resizable('disable');




                //添加点击控件选中事件
                // $('.canvas').on('click', '.control', function (e) {
                //     selectControl(this);
                //     return false;
                // });

                //点击空白区域取消选中, 点击control选中control
                $('.stage').on('click', function (e) {
                    if (!$(e.target).hasClass('control')) {
                        deselectControl($active);
                    } else {
                        selectControl(e.target);
                    }
                });

                //拖拽开始的时候选中
                $('.canvas').on('dragstart', '.control', function (e) {
                    selectControl(this);
                });

                //键盘控制控件移动
                $(document)
                    .on('keyup', function (e) {
                        console.log(e);
                    });
            })();
        }
    };
});