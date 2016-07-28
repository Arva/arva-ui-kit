import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/circleminus_default.svg.txt!text';

export class CircleminusIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }