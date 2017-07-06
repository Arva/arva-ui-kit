import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/cloudup_default.svg.txt!text';

export class CloudupIcon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }