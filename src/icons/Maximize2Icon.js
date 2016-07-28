import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/maximize2_default.svg.txt!text';

export class Maximize2Icon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }