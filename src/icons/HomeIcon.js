import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/home_default.svg.txt!text';

export class HomeIcon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }