define(['text!templates/layout.html', 'jquery', 'jqueryui', 'jquerytmpl'], function (tpl, $) {
    $.widget('nova.LayoutDashboard', {
        options: {
            top: true,  //最前
            bottom: false, //最后
            back: true, //向后
            forward: true, //向前

            width: 300, //宽度
            height: 200, //高度
            keepRatio: false, //保持比例

            x: 0,  //坐标x
            y: 0,  //坐标y

            rotate: 0 //旋转角度
        },
        _create: function () {
            //填充数据
            this.element.html($.tmpl(tpl, this.options));


            $('[ui=button]', this.element).button();
            $('[ui=number]', this.element).spinner();

            $('[ui=angle]', this.element).spinner({
                max: 360,
                min: 0
            });

            //挂载事件
        },
        _distroy: function () {
            //todo
            //
        }
    });
});