import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/maximize_default.svg.txt!text';

export class MaximizeIcon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }