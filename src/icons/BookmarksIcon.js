import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/bookmarks_default.svg.txt!text';

export class BookmarksIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }