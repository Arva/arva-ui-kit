import {BaseIcon}					from '../../BaseIcon.js';
import iconImage					from '../../resources/trash2_angular_bold.svg.txt!text';

export class Trash2Icon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}