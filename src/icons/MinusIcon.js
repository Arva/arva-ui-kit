import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/minus_default.svg.txt!text';

export class MinusIcon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }