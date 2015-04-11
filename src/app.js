define(['jquery', 'scripts/stage', 'scripts/dashboards/animation', 'scripts/dashboards/text'], function ($) {
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

            $('.stage').stage();

            //animate dashboard
            // $('.dashboard').animationdash()
            //     .on('animationdashpreview', function (e, animate) {
            //         var selections = $('.stage').stage('getSelection');
            //         $.each(selections, function (i, $control) {
            //             $control.addClass('animated ' + animate.name);
            //             $control.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', (function (_control, animateName) {
            //                 return function () {
            //                     _control.removeClass('animated ' + animateName);
            //                 };
            //             })($control, animate.name));
            //         });
            //     });

            $('.dashboard').textdash();
                
        }
    };
});