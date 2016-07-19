import {BaseIcon}					from '../../BaseIcon.js';
import iconImage					from '../../resources/search_rounded_thin.svg.txt!text';

export class SearchIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}