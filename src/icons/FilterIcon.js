import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/filter_default.svg.txt!text';

export class FilterIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }