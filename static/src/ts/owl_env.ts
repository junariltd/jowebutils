///<amd-module name='jowebutils.owl_env'/>

import { Env } from "@odoo/owl/dist/types/component/component";
import { Router } from "@odoo/owl/dist/types/router/router";

export interface IOWLEnv extends Env {
    router: Router;
    services: {
        rpc: (params: any, options?: any) => any;
    };
    loadedXmlDependencies: string[];
}
