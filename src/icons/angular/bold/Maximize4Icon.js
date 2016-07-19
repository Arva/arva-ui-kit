import {BaseIcon}					from '../../BaseIcon.js';
import iconImage					from '../../resources/maximize4_angular_bold.svg.txt!text';

export class Maximize4Icon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}