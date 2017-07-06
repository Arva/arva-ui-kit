import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/circleckeck_default.svg.txt!text';

export class CircleckeckIcon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }