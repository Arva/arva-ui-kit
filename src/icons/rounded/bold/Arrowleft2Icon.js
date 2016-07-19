import {BaseIcon}					from '../../BaseIcon.js';
import iconImage					from '../../resources/arrowleft2_rounded_bold.svg.txt!text';

export class Arrowleft2Icon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}