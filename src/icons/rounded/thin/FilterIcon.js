import {BaseIcon}					from '../../BaseIcon.js';
import iconImage					from '../../resources/filter_rounded_thin.svg.txt!text';

export class FilterIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}