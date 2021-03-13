///<amd-module name='jowebutils.owl_app'/>

// Creates a OWL app entry point with the specified routes

import * as publicWidget from 'web.public.widget';
import * as rpc from 'web.rpc';
import * as session from 'web.session';

import { ComponentWrapper, WidgetAdapterMixin } from 'web.OwlCompatibility';
import { Component, tags, router } from '@odoo/owl';
import { Route } from '@odoo/owl/dist/types/router/router';

class App extends Component {}
App.components = { RouteComponent: router.RouteComponent }
App.template = tags.xml`<RouteComponent />`;

export interface OWLAppDefinition {
    selector: string;
    routes: Route[];
}

export function createOWLApp(appDef: OWLAppDefinition) {
    return publicWidget.Widget.extend(WidgetAdapterMixin, {
        selector: appDef.selector,

        init: function () {
            this.owl_component = new ComponentWrapper(this, App);
            const env = this.owl_component.env;
            env.router = new router.Router(this.owl_component.env, appDef.routes);
            this.populateOWLEnv();
        },

        populateOWLEnv: function () {
            // Populate OWL env from current odoo environment
            // Try to mimic odoo 14+ where possible, to make porting easier
            // https://github.com/odoo/odoo/blob/14.0/addons/web/static/src/js/common_env.js#L46

            const env = this.owl_component.env;
            env.services = {
                rpc: function(params: any, options: any) {
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