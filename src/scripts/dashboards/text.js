define(['jquery', 'handlebars', 'ui', 'scripts/dashboards/dash', 'css!styles/text.dash.css'], function ($, handlebars) {
    $.widget('nova.textdash', $.nova.dash, {
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
        _additionTpl: handlebars.compile($('#tpl-dash-text-addition').text()),
        _textTpl: handlebars.compile($('#tpl-text-view').text()),
        _enhance: function () {
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
        _refresh: function () {
            this._renderSummary();
        },
        _renderSummary: function () {
            var defaultProps = this.options.fontStyleset[0];
            var activeProps = this._getActiveProps();

            if (!activeProps.type) {
                $.extend(activeProps, defaultProps);
            }
            this.element.find('.ui-dash-summary')
                .html(this._textTpl(activeProps));
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