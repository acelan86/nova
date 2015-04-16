define(['jquery', 'handlebars', 'ui'], function ($, handlebars) {
    $.widget('nova.ImageControl', $.nova.Control, {
        options: {
            type: 'image',
            data: {
                src: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1952814213,3453404530&fm=58'
            }
        }
    }); 
});