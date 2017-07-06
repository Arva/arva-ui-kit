import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/arrowdown_default.svg.txt!text';

export class ArrowdownIcon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }