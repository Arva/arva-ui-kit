import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/arrowleft_default.svg.txt!text';

export class ArrowleftIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }