import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/maximize2_rounded_thin.svg.txt!text';

export class Maximize2Icon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }