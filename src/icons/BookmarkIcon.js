import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/bookmark_default.svg.txt!text';

export class BookmarkIcon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }