
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
            $.route('*', (e, params, query) => {
                console.log('routed to', e.route + this.objectToQueryString(query));
                this._routeChange(e.route, query);
            });
            // Route to current URL
            const loc = window.location;
            const url = loc.pathname + loc.search + loc.hash;
            this.go(url);
            return this._super();
        },

        go: function (url) {
            const newUrl = new URL(this.host + url);
            const newPath = newUrl.pathname
            const newQuery = newUrl.search ? newUrl.search.substr(1) : ''
            $.router.set({
                route: newPath,
                queryString: newQuery
            });
        },

        objectToQueryString: function (params) {
            if (!params) return '';
            return '?' + Object.keys(params).map((key) =>
                encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
            ).join('&');
        },

        _routeChange: function (path, query) {
            this.currentUrl = new URL(this.host + path + this.objectToQueryString(query));
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