define([
    'jquery',
    'handlebars',
    'scripts/asm',
    'scripts/stage',
    'scripts/dashboards/animation',
    'scripts/dashboards/style',
    'scripts/dashboards/text',
    'scripts/dashboards/dash',
    'scripts/dashboards/page',
    'scripts/dashboards/image'
], function ($, handlebars, asm) {
    return {
        run: function (doc) {
            //创建文档展现
            $('.canvas').html(asm.createDoc(doc));

            (function () {
                $('.navigation').buttonset();
            })();

            $('#check51').click(function () {
                var selections;
                $('.dashboard').remove();
                if (selections = $('.stage').stage('getSelection'), selections.length === 1) {
                    switch (selections[0].data('type')) {
                        case 'text': 
                            $('<div class="dashboard"/>')
                                .appendTo($('body'))
                                .textdash();
                            break;
                        default: 
                            $('<div class="dashboard"/>')
                                .appendTo($('body'))
                                .imagedash();
                    }
                } else {
                    $('<div class="dashboard"/>')
                        .appendTo($('body'))
                        .styledash();
                }
            });
            //设置鼠标滑轮缩放画布å
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
            // 
            //构造缩略图列表
            (function () {
                var pages = new Array(10);
                var tpl = handlebars.compile($('#tpl-thumb-list').text());
                var $active = null;

                $('.thumb-list ol')
                    .html(tpl({
                        pages: pages
                    }))
                    .on('click', '.item', function (e) {
                        $active && $active.removeClass('item-active');
                        $(this).addClass('item-active');
                        $active = $(this);
                        $('.canvas').data('i', parseInt($active.data('i'), 10));
                    });
            })();

            $('.stage').stage();

            $('.dashboard').remove();
            $('<div class="dashboard"/>')
                .appendTo($('body'))
                .pagedash();

            $('.stage')
                .on('stageactivepage', function (e, page) {
                    $('.dashboard').remove();
                    $('<div class="dashboard"/>')
                        .appendTo($('body'))
                        .pagedash();
                })
                .on('stageactivecontrol', function (e, controls) {
                    $('.dashboard').remove();
                    $('<div class="dashboard"/>')
                        .appendTo($('body'))
                        .animationdash()
                        .on('animationdashpreview', function (e, animate) {
                            var selections = $('.stage').stage('getSelection');
                            $('body').addClass('hide-selected');
                            var len = selections.length;
                            $.each(selections, function (i, $control) {
                                $control.addClass('animated ' + animate.name);
                                $control.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', (function (_control, animateName) {
                                    return function () {
                                        len--;
                                        _control.removeClass('animated ' + animateName);
                                        if (len <= 0) {
                                            $('body').removeClass('hide-selected');
                                        }
                                    };
                                })($control, animate.name));
                            });
                        });
                });

            // $('.text-dash').textdash();

            // $('.style-dash').styledash();
            // //
            // $('.page-dash').pagedash();
                
        }
    };
});