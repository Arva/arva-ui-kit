import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/circlecheck_default.svg.txt!text';

export class CirclecheckIcon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }