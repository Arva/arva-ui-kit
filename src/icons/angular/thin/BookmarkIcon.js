import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/bookmark_angular_thin.svg.txt!text';

 export class BookmarkIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}