import {BaseIcon}					from '../../BaseIcon.js';
import iconImage					from '../../resources/left_rounded_bold.svg.txt!text';

export class LeftIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}