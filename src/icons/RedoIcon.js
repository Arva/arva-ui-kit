import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/redo_default.svg.txt!text';

export class RedoIcon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }