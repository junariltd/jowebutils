odoo.define('jowebutils.forms', function (require) {
    'use strict';

    var core = require('web.core');
    var qweb = core.qweb;
    // var ajax = require('web.ajax');
    var Widget = require('web.Widget');

    // var _t = core._t;

    var CharField = Widget.extend({
        template: 'jowebutils.field_char',
        init: function (parent, field, default_value) {
            this.state = {
                field,
                value: default_value
            }
            return this._super(parent);
        },
    });

    var WebForm = Widget.extend({
        xmlDependencies: ['/jowebutils/static/src/xml/forms.xml'],

        init: function (parent) {
            this.state = {
                fields: [
                    { name: 'name', string: 'Name', type: 'char', required: true },
                    { name: 'date', string: 'Date', type: 'date', required: false }
                ]
            }
            return this._super(parent)
        },
        start: function () {
            // Render fields
            this.state.fields.forEach(field => {
                var field = new CharField(this, field);
                field.appendTo(this.$el);
            })
            return this._super();
        },
    });

    return {
        WebForm
    }

});