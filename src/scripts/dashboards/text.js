define(['jquery', 'handlebars', 'ui', 'css!styles/dash.css', 'css!styles/text.dash.css'], function ($, handlebars) {
    $.widget('nova.textdash', {
        props: {
            text: {}
        },
        options: {
            tabs: [
                {
                    label: "文本",
                    type: "text"
                }                 
            ],
            fontfamilys: [
                {name: '宋体'},
                {name: '微软雅黑'}
            ],
            fontStyleset: [
                {
                    fontFamily:'Helvetica',
                    fontSize: 40,
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    lineHeight: 1,
                    textAlign: 'left',
                    verticalAlign: 'center',
                    color: '#000',
                    type: "标题"
                },
                {
                    fontFamily:'simhei',
                    fontSize: 35,
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    lineHeight: 1,
                    textAlign: 'left',
                    verticalAlign: 'center',
                    color: "#000",
                    type: "标题(小)"
                },
                {
                    fontFamily:'simhei',
                    fontSize: 30,
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    lineHeight: 1,
                    textAlign: 'left',
                    verticalAlign: 'center',
                    color: "#000",
                    type: "副标题"
                },
                {
                    fontFamily:'simhei',
                    fontSize: 20,
                    fontWeight: 'normal',
                    fontStyle: 'italic',
                    lineHeight: 1,
                    textAlign: 'left',
                    verticalAlign: 'center',
                    color: "#000",
                    type: "正文"
                },
                {
                    fontFamily:'simhei',
                    fontSize: 14,
                    fontWeight: 'normal',
                    fontStyle: 'italic',
                    lineHeight: 1,
                    textAlign: 'left',
                    verticalAlign: 'center',
                    color: "#000",
                    type: "正文(小)"
                },
                {
                    fontFamily:'simhei',
                    fontSize: 20,
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    lineHeight: 1,
                    textAlign: 'left',
                    verticalAlign: 'center',
                    color: "#f00",
                    type: "说明(红色)"
                },
                {
                    fontFamily:'simhei',
                    fontSize: 18,
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    lineHeight: 1,
                    textAlign: 'left',
                    verticalAlign: 'center',
                    color: "#000",
                    type: "说明(粗体)"
                }
            ],
            active: 0
        },
        _mainTpl: handlebars.compile($('#tpl-dash-text').text()),
        _textTpl: handlebars.compile($('#tpl-text-view').text()),
        _create: function () {
            this.element
                .addClass('dash-ani')
                .html(this._mainTpl(this.options));

            //设置每个tab的宽度
            this.element.find('.ui-dash-tab')
                .width(this.element.width() / (this.options.tabs.length || 1));

            //font-family
            this.element.find('.ui-dash-text-font-family')
                .selectmenu();

            //font-size
            this.element.find('.ui-dash-text-font-size')
                .spinner();

            //text-style
            this.element.find('.ui-dash-text-style')
                .buttonset();

            //text-align
            this.element.find('.ui-dash-text-align')
                .buttonset();

            //vertical-align
            this.element.find('.ui-dash-text-vertical-align')
                .buttonset();

            //line-height
            this.element.find('.ui-dash-text-line-height')
                .spinner();

            this._init();

            this._on(this.element, {
                "click .ui-dash-summary": this._showFontStylesetHandle,
                "click .ui-font-styleset-item": this._selectFontStylesetHandle
            });

            $(window).click(function () {
                $('.ui-font-styleset-list').hide();
            });
        },
        _init: function () {
            this._select(this.options.active);
        },
        _select: function (index) {
            var me = this;

            this.options.active = index;

            //渲染tab
            this.element.find('.ui-dash-tab')
                .removeClass('active')
                .eq(this.options.active)
                .addClass('active');

            this._renderSummary();

            //@todo render panel

            // var activeOptions = this._getActiveOptions(),
            //     activeProps = this._getActiveProps();

            // //设置summary
            // this._renderAnimateView();

            // this._renderAnimateSelectList();

            // //根据是否是允许多选展现动画列表
            // if (activeOptions.muti) {
            //     this._renderAnimateList();
            //     $('.ui-dash-ani-list').show();
            // } else {
            //     $('.ui-dash-ani-list').hide();
            // }
        },
        _getActiveProps: function () {
            return this.props[this.options.tabs[this.options.active].type];
        },
        _renderSummary: function () {
            var defaultProps = this.options.fontStyleset[0];
            var activeProps = this._getActiveProps();

            if (!activeProps.type) {
                $.extend(activeProps, defaultProps);
            }
            $('.ui-dash-summary').html(this._textTpl(activeProps));
        },
        _showFontStylesetHandle: function (e) {
            var $list = $('.ui-font-styleset-list');

            $list.show();
            $list.height('auto');
            //设置高度
            if ($list.height() > 400) {
                $list.height(400);
            }

            $list.position({
                    my: "center top+10",
                    at: "center bottom",
                    of: $(e.target).closest('.ui-dash-summary')
                });
            return false;
        },
        _selectFontStylesetHandle: function (e) {
            var index = parseInt($(e.target).data('i'), 10);
            var styleset = this.options.fontStyleset[index];
            var activeProps = this._getActiveProps();

            $.extend(activeProps, styleset);
            this._renderSummary();
        }
    });
});