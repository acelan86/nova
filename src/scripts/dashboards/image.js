define(['jquery', 'handlebars', 'ui', 'scripts/dashboards/dash', 'css!styles/image.dash.css'], function ($, handlebars) {
    $.widget('nova.imagedash', $.nova.dash, {
        props: {
            image: {}
        },
        options: {
            tabs: [
                {
                    label: "图片",
                    type: "image"
                }
            ],
            active: 0
        },
        _enhance: function () {
        },
        _refresh: function () {
            this._renderSummary();
        },
        _renderSummary: function () {
            
        }
    });
});