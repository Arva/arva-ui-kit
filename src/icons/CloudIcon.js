import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/cloud_default.svg.txt!text';

export class CloudIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }