odoo.define('jowebutils.widgets', function (require) {
    'use strict';

    const Widget = require('web.Widget');

    const NavBar = Widget.extend({
        xmlDependencies: ['/jowebutils/static/src/xml/widgets.xml'],
        template: 'jowebutils.navbar',

        init: function (parent, breadcrumbs) {
            this.state = {
                breadcrumbs
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

    return {
        NavBar,
        Table
    }

});