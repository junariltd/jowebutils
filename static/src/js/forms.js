odoo.define('jowebutils.forms', function (require) {
    'use strict';

    var core = require('web.core');
    var qweb = core.qweb;
    // var ajax = require('web.ajax');
    var Widget = require('web.Widget');

    // var _t = core._t;

    var Field = Widget.extend({
        init: function (parent, field, default_value) {
            this.state = {
                field,
                value: default_value
            }
            return this._super(parent);
        },
    });

    var CharField = Field.extend({ template: 'jowebutils.field_char' });
    var DateTimeField = Field.extend({ template: 'jowebutils.field_datetime' });
    var DateField = Field.extend({ template: 'jowebutils.field_datetime' });
    var TimeField = Field.extend({ template: 'jowebutils.field_datetime' });
    var SelectionField = Field.extend({ template: 'jowebutils.field_selection' });

    // TODO: Convert to registry
    var FIELD_TYPE_MAP = {
        'char': CharField,
        'datetime': DateTimeField,
        'date': DateField,
        'time': TimeField,
        'selection': SelectionField
    }

    var WebForm = Widget.extend({
        xmlDependencies: ['/jowebutils/static/src/xml/forms.xml'],

        init: function (parent, fields) {
            this.state = {
                fields
            }
            return this._super(parent)
        },
        start: function () {
            // Render fields
            this.state.fields.forEach(field => {
                var field = new FIELD_TYPE_MAP[field.type](this, field);
                field.appendTo(this.$el);
            })
            return this._super();
        },
    });

    return {
        WebForm
    }

});