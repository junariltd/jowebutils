/// <amd-module name="jowebutils.owl_env" />
declare module "jowebutils.owl_env" {
    import { Env } from "@odoo/owl/dist/types/component/component";
    import { Router } from "@odoo/owl/dist/types/router/router";
    export interface IOWLEnv extends Env {
        router: Router;
        services: {
            rpc: (params: any, options?: any) => any;
        };
        loadedXmlDependencies: string[];
    }
}
/// <amd-module name="jowebutils.owl_app" />
declare module "jowebutils.owl_app" {
    import { Route } from '@odoo/owl/dist/types/router/router';
    export interface OWLAppDefinition {
        selector: string;
        routes: Route[];
        xmlDependencies?: string[];
    }
    export function createOWLApp(appDef: OWLAppDefinition): any;
}
