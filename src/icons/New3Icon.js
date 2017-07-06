import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/new3_default.svg.txt!text';

export class New3Icon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }