import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/new2_default.svg.txt!text';

export class New2Icon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }