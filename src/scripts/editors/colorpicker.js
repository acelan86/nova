define(['jquery', 'ui', 'css!styles/colorpicker.css'], function ($) {
    var COLORS = [
        '#51A7F9', '#70BF41', '#F5D328', '#F39019', '#EC5D57', '#B36AE2',
        '#0365C0', '#00882B', '#DCBD23', '#DE6A10', '#C82506', '#773F9B',
        '#164F86', '#0B5D18', '#C3971A', '#BD5B0C', '#861001', '#5F327C',
        '#002452', '#054109', '#A37512', '#924607', '#570706', '#3B1F4E',
        '#FFFFFF', '#DCDEE0', '#A6AAA9', '#53585F', '#000000'
    ];
    $.widget('ui.colorpicker', {
        _create: function () {
            this.icon = $('<div class="ui-colorpicker-icon"/>')
                .css('background-color', this.options.value || 'transparent');
            this.panel = $('<div class="ui-colorpicker-panel" />');
            this.element
                .addClass('ui-colorpicker')
                .append(this.icon);

            $('body').append(this.panel);

            var html = [];
            $.each(COLORS, function (i, color) {
                html.push('<div data-color="' + color + '" class="color-item" style="background-color:' + color + ';"></div>');
            });
            this.panel.html(html.join(''));

            this._on(this.element, {
                'click .ui-colorpicker-icon': this._showHandle
            });
            this.panel.on('click', $.proxy(this._selectHandle, this));

            var me = this;
            $(window).on('click', function () {
                me.panel.hide();
            });

        },
        value: function (newValue) {
            if (arguments.length) {
                this.options.value = newValue;
                this.icon.css('background-color', newValue);
                return;
            }
            return (this.options.value);
        },
        _showHandle: function (e) {
            this.panel
                .show()
                .position({
                    my: 'center top+10',
                    at: 'center bottom',
                    of: $(e.target)
                });
            return false;
        },
        _selectHandle: function (e) {
            var color = $(e.target).data('color');
            this.icon.css('background-color', color);
            this._trigger('change', e, {
                value: color
            });
        },
        _destory: function (e) {
            this.penel.off();
            this.panel.remove();
        }
    });
});