
odoo.define('jowebutils.router', function (require) {
    'use strict';

    const Widget = require('web.Widget');

    const RouterWidget = Widget.extend({
        jsLibs: [
            '/jowebutils/static/lib/deparam.js',
            '/jowebutils/static/lib/jquery.router.js'
        ],

        init: function (parent) {
            const loc = window.location;
            this.host = loc.protocol + '//' + loc.hostname;
            this.currentUrl = null;
            this.routes = [];
            this.routeWidgets = {};
            return this._super(parent)
        },

        addRoute: function (routeDef) {
            this.routes.push(routeDef);
        },

        start: function () {
            // Register router
            $.route('*', (e) => {
                console.log('routed to', e.route);
                this._routeChange(e.route);
            });
            // Route to current URL
            const loc = window.location;
            const url = loc.pathname + loc.search + loc.hash;
            this.go(url);
            return this._super();
        },

        go: function (url) {
            $.router.set(url);
        },

        _routeChange: function (url) {
            this.currentUrl = new URL(this.host + url);
            const path = this.currentUrl.pathname;
            let routeWidget = this.routeWidgets[path];
            let routePromise = Promise.resolve();
            if (!routeWidget) {
                const route = this.routes.find(r => r.path == path)
                if (!route) {
                    alert('Route "' + path + '" not found.'); // FIXME
                    return;
                }
                routeWidget = new route.widget(this, ...route.initArgs);
                this.routeWidgets[path] = routeWidget;
                routePromise = routeWidget.appendTo(this.$el);
            }
            return routePromise
                .then(() => {
                    if (routeWidget.onRouteEnter) {
                        return routeWidget.onRouteEnter();
                    }
                })
                .then(() => {
                    Object.values(this.routeWidgets).forEach(widget => {
                        if (widget != routeWidget) {
                            widget.do_hide();
                        }
                        else {
                            widget.do_show();
                        }
                    });
                });
        }
    });

    return {
        RouterWidget
    };

});