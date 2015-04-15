define(['jquery', 'handlebars', 'ui', 'css!styles/dash.css'], function ($, handlebars) {
    $.widget('nova.dash', {
        props: {
            defaults: {}
        },
        options: {
            type: 'base',
            tabs: [
                {
                    label: "默认",
                    type: "defaults"
                }
            ],
            active: 0
        },
        _getActiveOptions: function () {
            return this.options.tabs[this.options.active];
        },
        _getActiveProps: function () {
            return this.props[this.options.tabs[this.options.active].type];
        },
        _tpl: handlebars.compile($('#tpl-dash').text()),
        _create: function () {
            this.element
                .addClass('ui-dash ' + 'ui-dash' + this.options.type)
                .html(this._tpl(this.options));

            //设置每个tab的宽度
            this.element.find('.ui-dash-tab')
                .width(this.element.width() / (this.options.tabs.length || 1));

            this._on(this.element, {
                //tab click
                'click .ui-dash-tab': this._selectTabHandle
            });

            this.element.find('.ui-dash-summary')
                .html(this._summaryTpl ? this._summaryTpl(this.options) : '');

            this.element.find('.ui-dash-addition')
                .html(this._additionTpl ? this._additionTpl(this.options) : '');

            this._enhance();
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

            this._refreshView();
        },
        _selectTabHandle: function (e) {
            this._select(parseInt($(e.target).data('i'), 10));
        },
        //增加面板的具体结构，增强ui
        _enhance: $.noop,
        //渲染面板的方法
        _refresh: $.noop,
        _destroy: function () {
            console.log('dash destroy');
        },
        _refreshView: function () {
            this._refresh();
            //调整addition高度
            this.element.find('.ui-dash-addition')
                .height(
                    parseInt(this.element.css('height'), 10) -
                    parseInt(this.element.find('.ui-dash-summary').css('height'), 10) -
                    parseInt(this.element.find('.ui-dash-tabs').css('height'), 10)
                );
        }
    });
});