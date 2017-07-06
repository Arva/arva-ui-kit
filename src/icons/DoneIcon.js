import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/done_default.svg.txt!text';

export class DoneIcon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }