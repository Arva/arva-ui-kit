import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/clouddown_default.svg.txt!text';

export class ClouddownIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }