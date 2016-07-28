import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/trash_default.svg.txt!text';

export class TrashIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }