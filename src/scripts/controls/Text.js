define(['jquery', 'handlebars', 'ui'], function ($, handlebars) {
    $.widget('nova.TextControl', $.nova.Control, {
        options: {
            type: 'text',
            data: {
                text: '双击输入文字'
            }
        }
    }); 
});