import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/hamburger_default.svg.txt!text';

export class HamburgerIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }