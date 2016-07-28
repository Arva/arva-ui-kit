import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/arrowup_default.svg.txt!text';

export class ArrowupIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }