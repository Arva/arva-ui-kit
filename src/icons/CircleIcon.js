import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/circle_default.svg.txt!text';

export class CircleIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }