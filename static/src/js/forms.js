odoo.define('jowebutils.forms', function (require) {
    'use strict';

    const core = require('web.core');
    const qweb = core.qweb;
    // const ajax = require('web.ajax');
    const Widget = require('web.Widget');

    // const _t = core._t;

    const Alert = Widget.extend({
        xmlDependencies: ['/jowebutils/static/src/xml/forms.xml'],
        template: 'jowebutils.alert',
        init: function (parent) {
            this.state = {}
            return this._super(parent);
        },
        showAlert: function (alertText, alertType = 'danger', alertListItems = []) {
            this.state = {
                alert_text: alertText,
                alert_type: alertType,
                alert_list_items: alertListItems
            };
            this.renderElement();
            this.$el.removeClass('d-none');
        },
        hideAlert: function () {
            this.$el.addClass('d-none');
        }
    });

    const Field = Widget.extend({
        init: function (parent, mode, field, value) {
            this.state = {
                mode,
                field,
                value
            }
            return this._super(parent);
        },
        getValue: function () {
            if (this.state.field.type == 'selection') {
                const control = this.$('select').first();
                return control.val();
            }
            else if (this.state.field.type == 'many2one') {
                const control = this.$('select').first();
                const val = control.val();
                return val ? parseInt(val) : null;
            }
            else if (this.state.field.type == 'text') {
                const control = this.$('textarea').first();
                return control.val();
            }
            else {
                const control = this.$('input').first();
                return control.val();
            }
        },
        validate: function () {
            const errors = [];
            const value = this.getValue();
            const field = this.state.field;
            const required = field.required;
            if (required && typeof value != 'boolean' && !value) {
                errors.push("Field '" + field.string + "' is required.");
            }
            return errors;
        },
        setModeAndValue: function (mode, value) {
            this.state.mode = mode;
            this.state.value = value;
            this.renderElement();
        },
        formatValue: function (value) {
            if (this.state.field.type != 'boolean' && !value) {
                return '';
            }
            else if (this.state.field.type == 'selection' && value) {
                const match = this.state.field.selection.find((s) => s[0] == value)
                if (!match) return value;
                return match[1];
            }
            else if (value instanceof Array && value.length == 2 && !isNaN(value[0])) {
                return value[1]  // many2one value (id, name). Return name.
            }
            return value
        },
        setHasError: function (hasError) {
            if (hasError) {
                this.$el.addClass('joweb-field-has-error')
            }
            else {
                this.$el.removeClass('joweb-field-has-error')
            }
        },
        renderElement: function () {
            this._super();
            if (this.state.field.tooltip) {
                this.$el.find('[data-toggle="tooltip"]').tooltip();
            }
            const onChange = this.state.field.onChange;
            if (onChange) {
                if (this.state.field.type == 'selection') {
                    const control = this.$('select').first();
                    control.change(onChange);
                }
                else {
                    const control = this.$('input').first();
                    control.change(onChange);
                }
            }
        }
    });

    const CharField = Field.extend({ template: 'jowebutils.field_char' });
    const DateTimeField = Field.extend({ template: 'jowebutils.field_datetime' });
    const DateField = Field.extend({ template: 'jowebutils.field_datetime' });
    const TimeField = Field.extend({ template: 'jowebutils.field_datetime' });
    const TextField = Field.extend({ template: 'jowebutils.field_text' });
    const HtmlField = Field.extend({ template: 'jowebutils.field_html' });
    const SelectionField = Field.extend({ template: 'jowebutils.field_selection' });
    const Many2OneField = SelectionField.extend();

    // TODO: Convert to registry
    const FIELD_TYPE_MAP = {
        'char': CharField,
        'datetime': DateTimeField,
        'date': DateField,
        'time': TimeField,
        'text': TextField,
        'html': HtmlField,
        'selection': SelectionField,
        'many2one': Many2OneField
    }

    const WebForm = Widget.extend({
        xmlDependencies: ['/jowebutils/static/src/xml/forms.xml'],

        init: function (parent, mode, fields, initial_data) {
            this.state = {
                mode,
                fields,
                initial_data,
            }
            this.fieldWidgets = {};
            return this._super(parent)
        },
        start: function () {
            // Render fields
            this.state.fields.forEach(field => {
                const fieldValue = this.state.initial_data[field.name];
                const widget = new FIELD_TYPE_MAP[field.type](this, this.state.mode, field, fieldValue);
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
        setValues: function (values) {
            this.state.fields.forEach(field => {
                const fieldValue = values[field.name];
                const widget = this.fieldWidgets[field.name];
                widget.setModeAndValue(this.state.mode, fieldValue);
            });
        },
        setValue: function (field_name, value) {
            const widget = this.fieldWidgets[field_name];
            widget.setModeAndValue(this.state.mode, value);
        },
        setModeAndValues: function (mode, values) {
            this.state.mode = mode;
            this.setValues(values);
        },
        validate: function () {
            const errors = [];
            this.state.fields.forEach(field => {
                const widget = this.fieldWidgets[field.name];
                const fieldErrors = widget.validate();
                if (fieldErrors.length) {
                    errors.push(...fieldErrors);
                    widget.setHasError(true);
                }
                else {
                    widget.setHasError(false);
                }
            });
            return errors;
        },
    });

    return {
        Alert,
        WebForm
    }

});