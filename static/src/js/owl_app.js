odoo.define('jowebutils.owl_app', function (require) {
    'use strict';

    // Creates a OWL app entry point with the specified routes

    const publicWidget = require('web.public.widget');

    const { ComponentWrapper, WidgetAdapterMixin } = require('web.OwlCompatibility');
    const { Component, tags } = owl;
    const { Router, RouteComponent } = owl.router;

    class App extends Component {}
    App.components = { RouteComponent }
    App.template = tags.xml`<RouteComponent />`;

    function createOWLApp({ selector, routes }) {
        return publicWidget.Widget.extend(WidgetAdapterMixin, {
            selector: selector,

            init: function () {
                this.owl_component = new ComponentWrapper(this, App);
                this.owl_component.env.router = new Router(this.owl_component.env, routes);
            },

            start: function () {
                return this.owl_component.env.router.start()
                    .then(() => {
                        this.owl_component.mount(this.el);
                    });
            }
        });
    }

    return {
        createOWLApp
    }

});