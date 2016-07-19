import {BaseIcon}					from '../../BaseIcon.js';
import iconImage					from '../../resources/more_angular_bold.svg.txt!text';

export class MoreIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}