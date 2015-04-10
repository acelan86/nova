define(['text!templates/animate.html', 'jquery', 'jqueryui', 'jquerytmpl'], function (tpl, $) {
    var LIST = [
        'bounce',
        'flash',
        'pulse',
        'rubberBand',
        'shake',
        'swing',
        'tada',
        'wobble',
        'bounceIn',
        'bounceInDown',
        'bounceInLeft',
        'bounceInRight',
        'bounceInUp',
        'bounceOut',
        'bounceOutDown',
        'bounceOutLeft',
        'bounceOutRight',
        'bounceOutUp',
        'fadeIn',
        'fadeInDown',
        'fadeInDownBig',
        'fadeInLeft',
        'fadeInLeftBig',
        'fadeInRight',
        'fadeInRightBig',
        'fadeInUp',
        'fadeInUpBig',
        'fadeOut',
        'fadeOutDown',
        'fadeOutDownBig',
        'fadeOutLeft',
        'fadeOutLeftBig',
        'fadeOutRight',
        'fadeOutRightBig',
        'fadeOutUp',
        'fadeOutUpBig',
        'flipInX',
        'flipInY',
        'flipOutX',
        'flipOutY',
        'lightSpeedIn',
        'lightSpeedOut',
        'rotateIn',
        'rotateInDownLeft',
        'rotateInDownRight',
        'rotateInUpLeft',
        'rotateInUpRight',
        'rotateOut',
        'rotateOutDownLeft',
        'rotateOutDownRight',
        'rotateOutUpLeft',
        'rotateOutUpRight',
        'hinge',
        'rollIn',
        'rollOut',
        'zoomIn',
        'zoomInDown',
        'zoomInLeft',
        'zoomInRight',
        'zoomInUp',
        'zoomOut',
        'zoomOutDown',
        'zoomOutLeft',
        'zoomOutRight',
        'zoomOutUp',
        'slideInDown',
        'slideInLeft',
        'slideInRight',
        'slideInUp',
        'slideOutDown',
        'slideOutLeft',
        'slideOutRight',
        'slideOutUp',
    ];
    $.widget('nova.animatedashboard', {
        options: {
            animate: 'bounce'
        },
        _create: function () {
            var animates = [
                '<select value="' + this.options.animate + '">',
                '<option value="none">无</option>'
            ];
            var i = 0,
                animate;
            while (animate = LIST[i++]) {
                animates.push('<option value="' + animate + '">' + animate + '</option>');
            };
            animates.push('</select>');

            this.element.html($.tmpl(tpl, this.options));

            $('[ui=animate]', this.element)
                .html(animates.join(''));

            this._on(this.element, {
                "change select": function (e) {
                    this._trigger('change', e, { value: $(e.target).val()});
                }
            });
        },
        _destory: function () {

        }
    });
});