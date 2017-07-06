import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/search_default.svg.txt!text';

export class SearchIcon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }