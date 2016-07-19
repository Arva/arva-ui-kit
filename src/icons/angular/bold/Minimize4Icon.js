import {BaseIcon}					from '../../BaseIcon.js';
import iconImage					from '../../resources/minimize4_angular_bold.svg.txt!text';

export class Minimize4Icon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}