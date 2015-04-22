/**
 * 组装编译整个数据的方法
 */
define(['jquery', 'handlebars'], function ($, handlebars) {
    var tplCache = {};

    return {
        baseStyles: function () {
            //页面的基础样式
            //
            //.control{
            //  overflow:hidden;
            //  position:absoulte;
            //}
            //.foreground{
            //  position:absolute;
            //  left:0;
            //  top:0;
            //  bottom:0;
            //  right:0;
            //  zindex: 91;
            //  pointer-events: none;
            //}
        },
         // "entrance": [
        //         {
        //             "name"      : "bounceIn", /*动画名称*/
        //             "delay"     : 0.5,      /*动画延迟*/
        //             "duration"  : 1         /*动画持续时间*/
        //         }
        //     ],
        //     /* 效果列表， 多个 */
        //     "attention": [
        //         {
        //             "name"      : "bounce", /*动画名称*/
        //             "delay"     : 0.5,      /*动画延迟*/
        //             "duration"  : 1         /*动画持续时间*/
        //         }
        //     ],
        //     /* 退出动画，仅一个 */
        //     "exit": [
        //         {
        //             "name"      : "bounceOut", /*动画名称*/
        //             "delay"     : 0.5,      /*动画延迟*/
        //             "duration"  : 1         /*动画持续时间*/
        //         }
        //     ]
        //     
        //-webkit-animation-name:       bounceIn, bounce, bounceOut;
        // -webkit-animation-duration:  1s,       1s,     1s;
        // -webkit-animation-delay:     0.5s,     2s,     3.5s;*/

        //创建动画style
        createAnimationStyleString: function (animates) {
            animates = animates || {};

            var baseDelay = 0;
            var styles = [];
            
            var animateStyle = [];
            //entrance，attention, exit阶段的动画生成
            $.each(['entrance', 'attention', 'exit'], function (i, type) {
                var max = 0;
                $.each(animates[type] || [], function (i, animate) {
                    var name = animate.name;
                    var duration = animate.duration || 0;
                    var delay = (animate.delay || 0);
                    var infinite = animate.infinite;
                    if (delay + duration > max) {
                        max = delay + duration;
                    }
                    delay += baseDelay;
                    animateStyle.push({
                        name:       name,                       //拼装动画名
                        duration:   duration + 's',             //持续时间
                        delay:      delay + 's',                //延迟时间
                        infinite:   !!infinite                  //是否无线循环播放
                    });
                });
                baseDelay += max;
            });

            return animateStyle;
        },

        /*
         * {
            "background": {
                "color" : "#fff",
                "image" : {
                    "src": "xxxx.png",
                    "owidth": 100,
                    "oheight": 100
                }
            },
            "border": {
                "width": 1,
                "style": "dotted",
                "color": "#ccc"
            },
            "shadow": {
                "x": 1,
                "y": 2,
                "blur": 2,
                "color": "#fff"
            }
         */
        createStylesStyleString: function (styles) {
            styles = styles || {};

            var background = styles.background || {};
            var border = styles.border || {};
            var shadow = styles.shadow || {};
            var tmp = [];

            if (background.color) {
                tmp.push('background-color:', background.color, ';');
            }
            if (background.image) {
                tmp.push(
                    'background-image:url(' +  background.image.src + ');',
                    'background-position:center center;',
                    'background-size:cover;',
                    'background-repeat:no-repeat;'
                );
            }

            if (border.width) {
                tmp.push(
                    'border:',
                    border.width + 'px ',
                    (border.style || "solid") + ' ',
                    (border.color || "#000"),
                    ';'
                );
            }

            if (shadow.x || shadow.y || shadow.blur || shadow.color) {
                tmp.push(
                    'box-shadow:',
                    (shadow.x || 1) + 'px ',
                    (shadow.y || 1) + 'px ',
                    (shadow.blur || 1) + 'px ',
                    (shadow.color || "#000"),
                    ';'
                );
            }
            
            return tmp.join('');

        },

        createContent: function (type, width, height, data) {
            var tpl = this.getControlTpl(type);
            return tpl(
                $.extend({}, data, {
                    width: width,
                    height: height
                })
            );
        },

        /*
         * {
                "x": 10,
                "y": 10,
                "z": 10,
                "width": 200,
                "height": 100
            }
         */
        createLayoutStyleString: function (layout) {
            layout = layout || {};

            return [
                'position:absolute;',
                'left:' + (layout.x || 0) + 'px;',
                'top:' + (layout.y || 0) + 'px;',
                'width:' + (layout.width || 100) + 'px;',
                'height:' + (layout.height || 100) + 'px;'
            ].join('');
        },

        createControl: function (data) {
            var animates = this.createAnimationStyleString(data.animates),
                style = this.createStylesStyleString(data.styles),
                html = this.createContent(data.type, data.layout.width, data.layout.height, data.data),
                layout = data.layout || {},
                animate,
                i = 0;

            //加上样式覆盖层
            html = [
                '<div style="', style, '">',
                    html,
                '</div>'
            ].join('');
            //加上动画层
            while ((animate = animates[i++])) {
                html = [
                    '<div class="animate" style="',
                        '-webkit-animation-name:', animate.name, ';',
                        '-webkit-animation-delay:', animate.delay, ';',
                        '-webkit-animation-duration:', animate.duration, ';',
                        (animate.infinite ? '-webkit-animation-infinite:infinite;' : ''), '">',
                        html,
                    '</div>'
                ].join('');
            }
            //包括布局层
            html = [
                '<div class="control" style="',
                    'left:' + (layout.x || 0) + 'px;',
                    'top:' + (layout.y || 0) + 'px;', '">',
                    html,
                '</div>'
            ].join('');

            return html;
        },

        //获取模板
        getControlTpl: function (type) {
            var tpl;
            if (!(tpl = tplCache[type])) {
                tpl = handlebars.compile($('#tpl-ctrl-' + type).text());
                tplCache[type] = tpl;
            }
            return tpl;
        },
        // 前景
        // "foreground": {
        //     "color": "#fff",
        //     "image": {
        //         "src": "xxxx.png",
        //         "owidth": 100,
        //         "oheight": 100
        //     }
        // }
        createPageForegroudStyleString: function (foreground) {
            foreground = foreground || {};
            var tmp = [];
            if (foreground.color) {
                tmp.push('background-color:', foreground.color, ';');
            }
            if (foreground.image) {
                tmp.push(
                    'background-image:url(' +  foreground.image.src + ');',
                    'background-position:center center;',
                    'background-size:cover;',
                    'background-repeat:no-repeat;'
                );
            }
            return tmp.join('');
        },
        // 背景
        //     "background": {
        //         "color": "#fff",
        //         "image": {
        //             "src": "xxxx.png",  /* 图片地址 */
        //             "owidth": 100,      /* 原始宽度 */
        //             "oheight": 100      /* 原始高度 */
        //         }
        //     }
        createPageBackgroudStyleString: function (background) {
            background = background || {};
            var tmp = [];
            if (background.color) {
                tmp.push('background-color:', background.color, ';');
            }
            if (background.image) {
                tmp.push(
                    'background-image:url(' +  background.image.src + ');',
                    'background-position:center center;',
                    'background-size:cover;',
                    'background-repeat:no-repeat;'
                );
            }
            return tmp.join('');
        },
        createPage: function (page) {
            var me = this;
            var controls = [];

            $.each(page.controls || [], function (i, control) {
                controls.push(me.createControl(control));
            });

            return [
                '<section class="page" style="', this.createPageBackgroudStyleString(page.background), '">',
                    '<div class="foreground" style="', this.createPageForegroudStyleString(page.foreground), '"></div>',
                    controls.join(''),
                '</section>'
            ].join('');
        },
        createDoc: function (doc) {
            var me = this;
            var pages = [];

            doc = doc || {};

            $.each(doc.pages || [], function (i, page) {
                pages.push(me.createPage(page));
            });

            return [
                '<section class="doc">',
                    pages.join(''),
                '</section>'
            ].join('');
        }
    };
});