odoo.define('jowebutils.forms', function (require) {
    'use strict';

    const core = require('web.core');
    const qweb = core.qweb;
    // const ajax = require('web.ajax');
    const Widget = require('web.Widget');

    // const _t = core._t;

    const Field = Widget.extend({
        init: function (parent, field, default_value) {
            this.state = {
                field,
                value: default_value
            }
            return this._super(parent);
        },
        getValue: function () {
            if (this.state.field.type == 'selection') {
                const control = this.$el.find('select').first();
                return control.val();
            }
            else {
                const control = this.$el.find('input').first();
                return control.val();
            }
        }
    });

    const CharField = Field.extend({ template: 'jowebutils.field_char' });
    const DateTimeField = Field.extend({ template: 'jowebutils.field_datetime' });
    const DateField = Field.extend({ template: 'jowebutils.field_datetime' });
    const TimeField = Field.extend({ template: 'jowebutils.field_datetime' });
    const SelectionField = Field.extend({ template: 'jowebutils.field_selection' });

    // TODO: Convert to registry
    const FIELD_TYPE_MAP = {
        'char': CharField,
        'datetime': DateTimeField,
        'date': DateField,
        'time': TimeField,
        'selection': SelectionField
    }

    const WebForm = Widget.extend({
        xmlDependencies: ['/jowebutils/static/src/xml/forms.xml'],

        init: function (parent, fields) {
            this.state = {
                fields
            }
            this.fieldWidgets = {};
            return this._super(parent)
        },
        start: function () {
            // Render fields
            this.state.fields.forEach(field => {
                const widget = new FIELD_TYPE_MAP[field.type](this, field);
                this.fieldWidgets[field.name] = widget;
                widget.appendTo(this.$el);
            })
            return this._super();
        },
        getValues: function () {
            const form_data = {};
            this.state.fields.forEach(field => {
                const widget = this.fieldWidgets[field.name];
                form_data[field.name] = widget.getValue()
            });
            return form_data;
        },
    });

    return {
        WebForm
    }

});