import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/arrowright_default.svg.txt!text';

export class ArrowrightIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }