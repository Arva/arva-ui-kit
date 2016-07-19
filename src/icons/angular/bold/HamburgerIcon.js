import {BaseIcon}					from '../../BaseIcon.js';
import iconImage					from '../../resources/hamburger_angular_bold.svg.txt!text';

export class HamburgerIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}