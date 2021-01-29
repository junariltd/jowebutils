odoo.define('jowebutils.owl_app', function (require) {
    'use strict';

    // Creates a OWL app entry point with the specified routes

    const publicWidget = require('web.public.widget');
    const rpc = require('web.rpc');
    const session = require('web.session');

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
                const env = this.owl_component.env;
                env.router = new Router(this.owl_component.env, routes);
                this.populateOWLEnv(env);
            },

            populateOWLEnv: function () {
                // Populate OWL env from current odoo environment
                // Try to mimic odoo 14+ where possible, to make porting easier
                // https://github.com/odoo/odoo/blob/14.0/addons/web/static/src/js/common_env.js#L46

                const env = this.owl_component.env;
                env.services = {
                    rpc: function(params, options) {
                        const query = rpc.buildQuery(params);
                        return session.rpc(query.route, query.params, options);
                    }
                }
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