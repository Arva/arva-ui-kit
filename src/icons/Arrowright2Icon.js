import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/arrowright2_rounded_thin.svg.txt!text';

export class Arrowright2Icon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }