odoo.define('jowebutils.loading', function (require) {
    "use strict";

    /**
     * Loading Indicator - stolen verbatim from web/.../js/chrome/loading.js
     * and modified slightly to work on the public website :)
     *
     * When the user performs an action, it is good to give him some feedback that
     * something is currently happening.  The purpose of the Loading Indicator is to
     * display a small rectangle on the bottom right of the screen with just the
     * text 'Loading' and the number of currently running rpcs.
     *
     * After a delay of 3s, if a rpc is still not completed, we also block the UI.
     */

    var config = require('web.config');
    var core = require('web.core');
    // var framework = require('web.framework'); - not available in website
    // var Widget = require('web.Widget');
    const publicWidget = require('web.public.widget');

    var _t = core._t;

    publicWidget.registry.JOWebUtilsLoadingIndicator = publicWidget.Widget.extend({
        selector: '.jowebutils_loading_indicator',
        xmlDependencies: ['/jowebutils/static/src/xml/widgets.xml'],

        init: function (parent) {
            this._super(parent);
            this.count = 0;
            this.blocked_ui = false;
        },
        start: function () {
            core.bus.on('rpc_request', this, this.request_call);
            core.bus.on("rpc_response", this, this.response_call);
            core.bus.on("rpc_response_failed", this, this.response_call);
        },
        destroy: function () {
            this.on_rpc_event(-this.count);
            this._super();
        },
        request_call: function () {
            this.on_rpc_event(1);
        },
        response_call: function () {
            this.on_rpc_event(-1);
        },
        on_rpc_event: function (increment) {
            var self = this;
            if (!this.count && increment === 1) {
                // Block UI after 3s
                this.long_running_timer = setTimeout(function () {
                    self.blocked_ui = true;
                    // framework.blockUI();
                }, 3000);
            }

            this.count += increment;
            if (this.count > 0) {
                // if (config.isDebug()) {
                //     this.$el.text(_.str.sprintf(_t("Loading (%d)"), this.count));
                // } else {
                this.$el.text(_t("Loading..."));
                // }
                this.$el.show();
                this.getParent().$el.addClass('oe_wait');
            } else {
                this.count = 0;
                clearTimeout(this.long_running_timer);
                // Don't unblock if blocked by somebody else
                if (self.blocked_ui) {
                    this.blocked_ui = false;
                    // framework.unblockUI();
                }
                this.$el.fadeOut();
                this.getParent().$el.removeClass('oe_wait');
            }
        }
    });
});
