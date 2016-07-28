import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/left_default.svg.txt!text';

export class LeftIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }