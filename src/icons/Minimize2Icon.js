import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/minimize2_default.svg.txt!text';

export class Minimize2Icon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }