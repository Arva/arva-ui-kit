import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/minimize3_default.svg.txt!text';

export class Minimize3Icon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }