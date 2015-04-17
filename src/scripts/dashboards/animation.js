define(['jquery', 'handlebars', 'ui', 'scripts/dashboards/dash', 'css!styles/animation.dash.css'], function ($, handlebars) {
    var ENTRANCE_EFFECTS = {
        "bouncing": [
            'bounceIn',
            'bounceInDown',
            'bounceInLeft',
            'bounceInRight',
            'bounceInUp'
        ],
        "fading": [
            'fadeIn',
            'fadeInDown',
            'fadeInDownBig',
            'fadeInLeft',
            'fadeInLeftBig',
            'fadeInRight',
            'fadeInRightBig',
            'fadeInUp',
            'fadeInUpBig'
        ],
        "rotating": [
            'rotateIn',
            'rotateInDownLeft',
            'rotateInDownRight',
            'rotateInUpLeft',
            'rotateInUpRight'
        ],
        "sliding": [
            'slideInUp',
            'slideInDown',
            'slideInLeft',
            'slideInRight'
        ],
        "zooming": [
            'zoomIn',
            'zoomInDown',
            'zoomInLeft',
            'zoomInRight',
            'zoomInUp'
        ],
        "flipers": [
            'flipInX',
            'flipInY'
        ],
        "specials": [
            'rollIn',
            'lightSpeedIn'
        ]
    };
    var EXIT_EFFECTS = {
        'bouncing': [
            'bounceOut',
            'bounceOutDown',
            'bounceOutLeft',
            'bounceOutRight',
            'bounceOutUp'
        ],
        "fading": [
            'fadeOut',
            'fadeOutDown',
            'fadeOutDownBig',
            'fadeOutLeft',
            'fadeOutLeftBig',
            'fadeOutRight',
            'fadeOutRightBig',
            'fadeOutUp',
            'fadeOutUpBig',
        ],
        "rotating": [
            'rotateOut',
            'rotateOutDownLeft',
            'rotateOutDownRight',
            'rotateOutUpLeft',
            'rotateOutUpRight'
        ],
        "sliding": [
            'slideOutDown',
            'slideOutLeft',
            'slideOutRight',
            'slideOutUp'
        ],
        "zooming": [
            'zoomOut',
            'zoomOutDown',
            'zoomOutLeft',
            'zoomOutRight',
            'zoomOutUp'
        ],
        "flipers": [
            'flipOutX',
            'flipOutY'
        ],
        "specials": [
            'hinge',
            'rollOut',
            'lightSpeedOut'
        ]
    };

    var ATTENTION_EFFECTS = {
        'attention': [
            'bounce',
            'flash',
            'pulse',
            'rubberBand',
            'shake',
            'swing',
            'tada',
            'wobble'
        ]
    };

    $.widget('nova.animationdash', $.nova.dash, {
        props: {
            transition: [],
            entrance: [
                //{name: xx, delay: xx, duration: xx, active: true}
            ],
            attention: [],
            exit: []
        },
        options: {
            tabs: [
                {
                    label: "控件出现",
                    type: "entrance",
                    anisource: ENTRANCE_EFFECTS
                },
                {
                    label: "效果",
                    type: "attention",
                    anisource: ATTENTION_EFFECTS,
                    muti: true
                },
                {
                    label: "控件消失",
                    type: "exit",
                    anisource: EXIT_EFFECTS
                }                  
            ],
            active: 0
        },
        _getActiveAnimate: function () {
            var animate,
                animates = this._getActiveProps();
            $.each(animates, function (i, item) {
                if (item.active) {
                    animate = item;
                    return false;
                }
            });
            if (!animate && animates.length > 0) {
                animates[0].active = true;
                animate = animates[0];
            }
            return animate;
        },
        _additionTpl: handlebars.compile($('#tpl-dash-ani-addition').text()),

        _aniGroupTpl: handlebars.compile($('#tpl-ani-select-group').text()),
        _summaryViewTpl : {
            init: handlebars.compile($('#tpl-ani-init-summary').text()),
            modify: handlebars.compile($('#tpl-ani-modify-summary').text())
        },
        _aniListTpl : handlebars.compile($('#tpl-ani-list').text()),

        _enhance: function () {
            //初始化delay slider
            this.delaySlider = this.element.find('.delay-slider')
                .slider({
                    range: 'min',
                    step: 0.1,
                    min: 0,
                    max: 10
                });
                // .on('slidechange', function (e, ui) {
                //     console.log(e, ui);
                // });
            //初始化delay spinner
            this.delaySpinner = this.element.find('.delay-spinner')
                .spinner({
                    step: 0.1,
                    min: 0,
                    max: 10
                });

            //初始化duration slider
            this.durationSlider = this.element.find('.duration-slider')
                .slider({
                    range: 'min',
                    step: 0.1,
                    min: 0,
                    max: 10
                });
            //初始化duration spinner
            this.durationSpinner = this.element.find('.duration-spinner')
                .spinner({
                    step: 0.1,
                    min: 0,
                    max: 10
                });

            this._on(this.element, {
                //预览动画
                'click .item-preview': this._previewHandle,
                //点击item添加样式
                'click .ui-ani-select-list .ani-item': this._selectAnimateHandle,

                //删除动画
                'click .ui-dash-ani-ul .item-del': this._delAnimateHandle,
                //点击选中列表中的动画
                'click .ui-dash-ani-ul .ani-item': this._activeAnimateHandle,
                //点击添加按钮
                'click .new-button': this._showAnimateListHandle,
                //点击更改按钮
                'click .modify-button': this._showAnimateListHandle,
                //点击预览按钮
                'click .preview-button': this._previewHandle,
                //继续添加按钮
                'click .add-button': this._showAnimateListHandle,

                'slide .delay-slider': this._delaySliderChangeHandle,
                'spin .delay-spinner': this._delaySpinnerChangeHandle,
                'slide .duration-slider': this._durationSliderChangeHandle,
                'spin .duration-spinner': this._durationSpinnerChangeHandle

            });

            $(window).click(function () {
                $('.ui-ani-select-list').hide();
            });
        },
        _init: function () {
            this._select(this.options.active);
        },
        _refresh: function (index) {
            var activeOptions = this._getActiveOptions(),
                activeProps = this._getActiveProps();

            //设置summary
            this._renderAnimateView();

            this._renderAnimateSelectList();

            //根据是否是允许多选展现动画列表
            if (activeOptions.muti) {
                this._renderAnimateList();
                $('.ui-dash-ani-list').show();
            } else {
                $('.ui-dash-ani-list').hide();
            }    
        },
        _renderSummary: function () {
            var animate = this._getActiveAnimate();
            //根据是否有选中效果渲染
            this.element.find('.ui-dash-summary')
                .html(animate ? 
                    this._summaryViewTpl.modify(animate) :
                    this._summaryViewTpl.init()
                );
        },
        _renderAnimateSelectList: function () {
            var html = [],
                me = this,
                activeOptions = this._getActiveOptions();
            $.map(activeOptions.anisource, function (group, groupName) {
                html.push(me._aniGroupTpl({
                    label: groupName,
                    animates: group
                }));
            });

            this.element.find('.ui-ani-select-list')
                .html(html.join(''));
        },
        _previewHandle: function (e) {
            this._trigger('preview', e, {
                name: $(e.target).data('name')
            });
            return false;
        },
        _showAnimateListHandle: function (e) {
            var $list = $('.ui-ani-select-list');
            //记录是新建还是修改
            if (!$(e.target).hasClass('modify-button')) {
                $list.data('modify', 0);
            } else {
                $list.data('modify', 1);
            }

            $list.show();
            $list.height('auto');
            //设置高度
            if ($list.height() > 400) {
                $list.height(400);
            }

            $list.position({
                    my: "center top+10",
                    at: "center bottom",
                    of: $(e.target)
                });
            return false;
        },
        _delaySpinnerChangeHandle: function (e, ui) {
            var animate = this._getActiveAnimate();
            animate.delay = ui.value;
            this.delaySlider.slider('value', ui.value);
        },
        _delaySliderChangeHandle: function (e, ui) {
            var animate = this._getActiveAnimate();
            animate.delay = ui.value;
            this.delaySpinner.spinner('value', ui.value);
        },
        _durationSpinnerChangeHandle: function (e, ui) {
            var animate = this._getActiveAnimate();
            animate.duration = ui.value;
            this.durationSlider.slider('value', ui.value);
        },
        _durationSliderChangeHandle: function (e, ui) {
            var animate = this._getActiveAnimate();
            animate.duration = ui.value;
            this.durationSpinner.spinner('value', ui.value);
        },
        _activeAnimateHandle: function (e) {
            var animates = this._getActiveProps();
            var index = parseInt($(e.target).data('i'), 10);
            var animate;

            $.each(animates, function (i, item) {
                if (i === index) {
                    item.active = true;
                    animate = item;
                } else {
                    item.active = false;
                }
            });

            this._renderAnimateView();
            this._renderAnimateList();

            this._trigger('preview', e, animate);
        },
        _delAnimateHandle: function (e) {
            var animates = this._getActiveProps();
            var index = parseInt($(e.target).data('i'), 10);
            animates.splice(index, 1);

            this._renderAnimateView();
            this._renderAnimateList();
        },
        _selectAnimateHandle: function (e) {
            var name = $(e.target).data('name'),
                animate,
                data = this._getActiveProps();

            if (!$('.ui-ani-select-list').data('modify')) {
                //去除原有的active animate, 把当前设置成active
                $.each(data, function (i, item) {
                    item.active = false;
                });

                animate = {
                    name: name,
                    delay: 0,
                    duration: 1,
                    active: true
                };
                data.push(animate);
            } else {
                animate = this._getActiveAnimate();
                animate.name = name;
            }
            this._renderAnimateView();
            this._renderAnimateList();
            this._trigger('preview', e, animate);
        },
        _renderAnimateView: function () {
            if (!this._getActiveAnimate()) {
                this.element.addClass('ui-dash-ani-null');
            } else {
                this.element.removeClass('ui-dash-ani-null');
            }
            this._renderSummary();
            this._renderDelay();
            this._renderDuration();
        },
        _renderDelay: function () {
            var animate = this._getActiveAnimate();
            if (animate) {
                this.delaySpinner.spinner('value', animate.delay);
                this.delaySlider.slider('value', animate.delay);
            }
        },
        _renderDuration: function () {
            var animate = this._getActiveAnimate();
            if (animate) {
                this.durationSpinner.spinner('value', animate.duration);
                this.durationSlider.slider('value', animate.duration);
            }
        },
        _renderAnimateList: function () {
            var me = this;
            var animates = this._getActiveProps();
            this.element.find('.ui-dash-ani-ul')
                .html(
                    this._aniListTpl({
                        animates: animates
                    })
                );
        },
        _destroy: function () {
            console.log('animation dash destroy');
        }

    });
});