import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/cross_default.svg.txt!text';

export class CrossIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }