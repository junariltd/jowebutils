odoo.define('jowebutils.widgets', function (require) {
    'use strict';

    const Widget = require('web.Widget');

    const NavBar = Widget.extend({
        xmlDependencies: ['/jowebutils/static/src/xml/widgets.xml'],
        template: 'jowebutils.navbar',

        events: {
            'click a.breadcrumb-link': '_breadcrumbClicked'
        },

        init: function (parent, router, breadcrumbs) {
            this.router = router;
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
        },

        setBreadcrumbs: function (breadcrumbs) {
            this.state.breadcrumbs = breadcrumbs;
            this.renderElement();
        },

        _breadcrumbClicked: function (e) {
            e.preventDefault();
            const name = $(e.target).data('name');
            const external = $(e.target).data('external');
            const breadcrumb = this.state.breadcrumbs.find(b => b.name == name);
            if (breadcrumb.link) {
                if (external) {
                    window.location = breadcrumb.link;
                }
                else {
                    this.router.go(breadcrumb.link)
                }
            }
        }
    });

    const Table = Widget.extend({
        xmlDependencies: ['/jowebutils/static/src/xml/widgets.xml'],
        template: 'jowebutils.table',

        events: {
            'click a.table-row-link': '_rowClicked'
        },

        init: function (parent, columns, data) {
            this.state = {
                columns,
                data
            }
            return this._super(parent);
        },

        formatValue: function (value) {
            if (value instanceof Array && value.length == 2 && !isNaN(value[0])) {
                return value[1]  // many2one value (id, name). Return name.
            }
            return value
        },

        updateData: function (newData) {
            this.state.data = newData;
            this.renderElement();
        },

        _rowClicked: function (e) {
            e.preventDefault();
            const recordId = $(e.target).data('id');
            this.trigger('row_clicked', recordId);
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

        setButtons: function (buttons) {
            this.state.buttons = buttons;
            this.renderElement();
            this._attachButtonHandlers();
        },

        _attachButtonHandlers: function () {
            const buttons = this.state.buttons;
            buttons.forEach(button => {
                this.$("button[name='" + button.name + "']").click(() => {
                    this.trigger(button.name + '_clicked');
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