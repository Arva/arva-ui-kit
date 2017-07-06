import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/up_default.svg.txt!text';

export class UpIcon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }