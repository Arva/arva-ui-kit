import {BaseIcon}					from '../../BaseIcon.js';
import iconImage					from '../../resources/circle_rounded_thin.svg.txt!text';

export class CircleIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}