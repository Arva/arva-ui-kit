import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/info_default.svg.txt!text';

export class InfoIcon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }