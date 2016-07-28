import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/arrowdown_rounded_thin.svg.txt!text';

export class ArrowdownIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }