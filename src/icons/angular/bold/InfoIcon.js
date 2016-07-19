import {BaseIcon}					from '../../BaseIcon.js';
import iconImage					from '../../resources/info_angular_bold.svg.txt!text';

export class InfoIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}