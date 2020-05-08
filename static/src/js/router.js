
odoo.define('jowebutils.router', function (require) {
    'use strict';

    const Widget = require('web.Widget');

    const RouterWidget = Widget.extend({
        jsLibs: [
            '/jowebutils/static/lib/deparam.js',
            '/jowebutils/static/lib/jquery.router.js'
        ],

        init: function (parent) {
            this.state = {
                routes: [],
                routeWidgets: {},
            }
            return this._super(parent)
        },

        addRoute: function (routeDef) {
            this.state.routes.push(routeDef);
        },

        start: function () {
            // Register router
            $.route('*', (e) => {
                console.log('routed to', e.route);
                this._routeChange(e.route);
            });
            // Route to current URL
            const l = window.location;
            const currentUrl = l.pathname + l.search;
            this.go(currentUrl);
            return this._super();
        },

        go: function (url) {
            $.router.set(url);
        },

        _routeChange: function (url) {
            let routeWidget = this.state.routeWidgets[url];
            let routePromise = Promise.resolve();
            if (!routeWidget) {
                const route = this.state.routes.find(r => r.url == url)
                if (!route) {
                    alert('url ' + url + ' not found.'); // FIXME
                    return;
                }
                routeWidget = new route.widget(this, ...route.initArgs);
                this.state.routeWidgets[url] = routeWidget;
                routePromise = routeWidget.appendTo(this.$el);
            }
            return routePromise
                .then(() => {
                    if (routeWidget.onRouteEnter) {
                        return routeWidget.onRouteEnter();
                    }
                })
                .then(() => {
                    Object.values(this.state.routeWidgets).forEach(widget => {
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