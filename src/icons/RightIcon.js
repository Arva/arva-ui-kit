import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/right_default.svg.txt!text';

export class RightIcon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }