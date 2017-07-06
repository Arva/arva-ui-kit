import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/duplicate_default.svg.txt!text';

export class DuplicateIcon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }