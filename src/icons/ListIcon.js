import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/list_default.svg.txt!text';

export class ListIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }