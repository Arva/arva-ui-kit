import {BaseIcon}					from '../../BaseIcon.js';
import iconImage					from '../../resources/arrowright_rounded_bold.svg.txt!text';

export class ArrowrightIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}