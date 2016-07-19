import {BaseIcon}					from '../../BaseIcon.js';
import iconImage					from '../../resources/circlecross_angular_bold.svg.txt!text';

export class CirclecrossIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}