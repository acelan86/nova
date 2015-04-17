define(['jquery', 'handlebars', 'ui', 'scripts/dashboards/dash', 'css!styles/style.dash.css'], function ($, handlebars) {
    $.widget('nova.styledash', $.nova.dash, {
        props: {
            style: {
                borderWidth: 1,
                borderStyle: 'none',
                borderColor: '#000000',
                shadow: 'none',
                shadowBlur: 1,
                shadowOffsetX: 1,
                shadowOffsetY: 1,
                shadowColor: '#000000',
                shadowOpacity: 100,
                opacity: 100
            }
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
                'shadow-blur|0|10|1',
                'shadow-offset-x|0|10|1',
                'shadow-offset-y|0|10|1',
                'opacity|0|100|1',
                'border-width|1|10|1'
            ], function (i, item) {
                item = item.split('|');
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
                me.element.find('.' + key + '-spinner').spinner({
                    max: max,
                    min: min,
                    step: step
                });
            });

            this.element.find('select').selectmenu();

            $.each([
                'background',
                'shadow',
                'border'
            ], function (i, item) {
                me.element.find('.' + item + '-color').colorpicker();
            });

            this._on(this.element, {
                'selectmenuchange .shadow-switch': this._switchShadowHandle,
                'spin .shadow-opacity-spinner': this._spinShadowOpacityHandle,
                'spin .shadow-offset-x-spinner': this._spinShadowOffsetXHandle,
                'spin .shadow-offset-y-spinner': this._spinShadowOffsetYHandle,
                'spin .shadow-blur-spinner': this._spinShadowBlurHandle,
                'spin .opacity-spinner': this._spinOpacityHandle,
                'slide .shadow-opacity-slider': this._slideShadowOpacityHandle,
                'slide .shadow-offset-x-slider': this._slideShadowOffsetXHandle,
                'slide .shadow-offset-y-slider': this._slideShadowOffsetYHandle,
                'slide .shadow-blur-slider': this._slideShadowBlurHandle,
                'slide .opacity-slider': this._slideOpacityHandle
            });
        },
        _switchShadowHandle: function (e) {
            var props = this._getActiveProps();
            props.shadow = $(e.target).val();

            this._renderShadowView();
        },
        _slideShadowBlurHandle: function (e, ui) {
            var props = this._getActiveProps();
            props.shadowBlur = ui.value;
            this.element.find('.shadow-blur-spinner').spinner('value', ui.value);
        },
        _slideShadowOffsetYHandle: function (e, ui) {
            var props = this._getActiveProps();
            props.shadowOffsetY = ui.value;
            this.element.find('.shadow-offset-y-spinner').spinner('value', ui.value);
        },
        _slideShadowOffsetXHandle: function (e, ui) {
            var props = this._getActiveProps();
            props.shadowOffsetX = ui.value;
            this.element.find('.shadow-offset-x-spinner').spinner('value', ui.value);

        },
        _slideShadowOpacityHandle: function (e, ui) {
            var props = this._getActiveProps();
            props.shadowOpacity = ui.value;
            this.element.find('.shadow-opacity-spinner').spinner('value', ui.value);

        },
        _slideOpacityHandle: function (e, ui) {
            var props = this._getActiveProps();
            props.opacity = ui.value;
            this.element.find('.opacity-spinner').spinner('value', ui.value);
        },
        _spinOpacityHandle: function (e, ui) {
            var props = this._getActiveProps();
            props.opacity = ui.value;
            this.element.find('.opacity-slider').slider('value', ui.value);
        },
        _spinShadowBlurHandle: function (e, ui) {
            var props = this._getActiveProps();
            props.shadowBlur = ui.value;
            this.element.find('.shadow-blur-slider').slider('value', ui.value);

        },
        _spinShadowOffsetYHandle: function (e, ui) {
            var props = this._getActiveProps();
            props.shadowOffsetY = ui.value;
            this.element.find('.shadow-offset-y-slider').slider('value', ui.value);

        },
        _spinShadowOpacityHandle: function (e, ui) {
            var props = this._getActiveProps();
            props.shadowOpacity = ui.value;
            this.element.find('.shadow-opacity--slider').slider('value', ui.value);

        },
        _spinShadowOffsetXHandle: function (e, ui) {
            var props = this._getActiveProps();
            props.shadowOffsetX = ui.value;
            this.element.find('.shadow-offset-x-slider').slider('value', ui.value);

        },
        _renderBorderView: function () {
            var props = this._getActiveProps();

            this.element.find('.border-style').val(props.borderStyle);
            this.element.find('.border-color').colorpicker('value', props.borderColor);
            this.element.find('.border-width-spinner').spinner('value', props.borderWidth);
        },
        _renderShadowView: function () {
            var props = this._getActiveProps();

            this.element.find('.shadow-switch').val(props.shadow);

            if (props.shadow === 'none') {
                this.element.find('.shadow-switch-shadow').hide();
            } else {
                this.element.find('.shadow-switch-shadow').show();
                this.element.find('.shadow-blur-slider').slider('value', props.shadowBlur);
                this.element.find('.shadow-offset-x-slider').slider('value', props.shadowOffsetX);
                this.element.find('.shadow-offset-y-slider').slider('value', props.shadowOffsetY);
                this.element.find('.shadow-blur-spinner').spinner('value', props.shadowBlur);
                this.element.find('.shadow-offset-x-spinner').spinner('value', props.shadowOffsetX);
                this.element.find('.shadow-offset-y-spinner').spinner('value', props.shadowOffsetY);
                this.element.find('.shadow-color').colorpicker('value', props.shadowColor);
                this.element.find('.shadow-opacity-spinner').spinner('value', props.shadowOpacity);
                this.element.find('.shadow-opacity-slider').slider('value', props.shadowOpacity);
            }
        },
        _renderOpacityView: function () {
            var props = this._getActiveProps();

            this.element.find('.opacity-slider').slider('value', props.opacity);
            this.element.find('.opacity-spinner').spinner('value', props.opacity);
        },
        _refresh: function () {
            this._renderBorderView();
            this._renderShadowView();
            this._renderOpacityView();
        }
    });
});