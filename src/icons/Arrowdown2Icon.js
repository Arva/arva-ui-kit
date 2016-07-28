import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/arrowdown2_default.svg.txt!text';

export class Arrowdown2Icon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }