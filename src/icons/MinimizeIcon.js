import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/minimize_default.svg.txt!text';

export class MinimizeIcon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }