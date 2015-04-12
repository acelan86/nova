define(['jquery', 'handlebars', 'ui', 'scripts/dashboards/dash', 'css!styles/style.dash.css'], function ($, handlebars) {
    $.widget('nova.styledash', $.nova.dash, {
        props: {

        },
        options: {
            tabs: [
                {
                    label: "样式",
                    type: "style"
                }
            ]
        },
        _summaryTpl: $.noop,
        _additionTpl: handlebars.compile($('#tpl-dash-style-addition').text()),
        _enhance: function () {
            var me = this;
            $.each([
                'shadow-opacity|0|100|1',
                'shadow-blur|0|100|1',
                'shadow-offset|0|100|1',
                'opacity|0|100|1',
                'border-width|1|20|1'
            ], function (i, item) {
                var item = item.split('|');
                var key = item[0],
                    min = parseFloat(item[1], 10),
                    max = parseFloat(item[2], 10),
                    step = parseFloat(item[3], 10);

                me.element.find('.' + key + '-slider').slider({
                    range: 'min',
                    max: max,
                    min: min,
                    step: step
                });
                me.element.find('.' + key + '-spinner').spinner();
            });

            this.element.find('select').selectmenu();
        },
        _refresh: function () {

        }
    });
});