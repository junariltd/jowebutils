odoo.define('jowebutils.widgets', function (require) {
    'use strict';

    const Widget = require('web.Widget');

    const NavBar = Widget.extend({
        xmlDependencies: ['/jowebutils/static/src/xml/widgets.xml'],
        template: 'jowebutils.navbar',

        init: function (parent, breadcrumbs) {
            this.state = {
                breadcrumbs,
                searchbar_sortings: [
                    { label: 'Job Number' },
                    { label: 'Date Raised' },
                    { label: 'Status' },
                ],
                searchbar_filters: [
                    { label: 'All Requests' },
                    { label: 'Open Requests' },
                    { label: 'Closed Requests' },
                ],
                sortby: 0,
                filterby: 0,
            }
            return this._super(parent);
        }
    });

    const Table = Widget.extend({
        xmlDependencies: ['/jowebutils/static/src/xml/widgets.xml'],
        template: 'jowebutils.table',

        events: {
            'click a.table-row-link': '_rowClicked'
        },

        init: function (parent, name, columns, data) {
            this.state = {
                name,
                columns,
                data
            }
            return this._super(parent);
        },

        _rowClicked: function (e) {
            e.preventDefault();
            const tableName = this.state.name;
            const recordId = $(e.target).data('id');
            this.trigger_up(tableName + '_row_clicked', { id: recordId });
        }
    });

    const ButtonBar = Widget.extend({
        xmlDependencies: ['/jowebutils/static/src/xml/widgets.xml'],
        template: 'jowebutils.button_bar',

        init: function (parent, buttons) {
            this.state = {
                buttons
            }
            return this._super(parent);
        },

        start: function () {
            // attach button events
            this._attachButtonHandlers()
            return this._super();
        },

        _attachButtonHandlers: function () {
            const buttons = this.state.buttons;
            buttons.forEach(button => {
                this.$("button[name='" + button.name + "']").click(() => {
                    this.trigger_up(button.name + '_button_clicked');
                })
            });
        },
    });

    return {
        NavBar,
        Table,
        ButtonBar
    }

});