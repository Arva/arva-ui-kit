import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/info_rounded_thin.svg.txt!text';

export class InfoIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }