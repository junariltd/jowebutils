odoo.define('jowebutils.forms', function (require) {
    'use strict';

    var core = require('web.core');
    var qweb = core.qweb;
    // var ajax = require('web.ajax');
    var Widget = require('web.Widget');

    // var _t = core._t;

    var WebForm = Widget.extend({
        start: function () {
            console.log('web form widget started 2');
            this.$el.html('<div>form goes here</div>');
            return this._super();
        }
    });

    return {
        WebForm
    }

});