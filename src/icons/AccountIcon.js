import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/account_default.svg.txt!text';

export class AccountIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}