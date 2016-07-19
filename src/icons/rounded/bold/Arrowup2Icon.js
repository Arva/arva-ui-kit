import {BaseIcon}					from '../../BaseIcon.js';
import iconImage					from '../../resources/arrowup2_rounded_bold.svg.txt!text';

export class Arrowup2Icon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}