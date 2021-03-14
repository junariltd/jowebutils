///<amd-module name='jowebutils.forms.Form'/>

import { Component, tags, hooks, Context, QWeb } from '@odoo/owl';
import { IOWLEnv } from '../owl_env';

export interface IFormContext {
    values: {
        [fieldName: string]: any;
    }
    setValue?: (fieldName: string, value: any) => void;
}

export class Form extends Component<any, IOWLEnv> {
    constructor() {
        super(...arguments);
        const formContext: IFormContext = {
            values: {
                name: 'myName'
            },
            setValue: (fieldName, value) => console.log('setValue', fieldName, value)
        }
        this.env.formContext = new Context(formContext);
    }
}
Form.template = tags.xml /* xml */ `
    <form>
        <t t-slot="default" />
    </form>
`