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

        init: function (parent, columns, data) {
            this.state = {
                columns,
                data
            }
            return this._super(parent);
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
        }
    });

    return {
        NavBar,
        Table,
        ButtonBar
    }

});