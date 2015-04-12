/**
 * 单页属性
 */
define(['jquery', 'handlebars', 'ui', 'scripts/dashboards/dash', 'css!styles/page.dash.css'], function ($, handlebars) {
    $.widget('nova.pagedash', $.nova.dash, {
        props: {

        },
        options: {
            tabs: [
                {
                    label: "页",
                    type: "page"
                }
            ],
            active: 0
        },
        _additionTpl: handlebars.compile($('#tpl-dash-page-addition').text()),
        _enhance: function () {

        },
        _refresh: function () {
            
        }
    });
});