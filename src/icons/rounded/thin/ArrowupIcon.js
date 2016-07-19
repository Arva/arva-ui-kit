import {BaseIcon}					from '../../BaseIcon.js';
import iconImage					from '../../resources/arrowup_rounded_thin.svg.txt!text';

export class ArrowupIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}