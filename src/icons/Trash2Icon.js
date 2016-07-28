import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/trash2_default.svg.txt!text';

export class Trash2Icon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }