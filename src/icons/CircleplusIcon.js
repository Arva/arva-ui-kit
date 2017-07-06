import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/circleplus_default.svg.txt!text';

export class CircleplusIcon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }