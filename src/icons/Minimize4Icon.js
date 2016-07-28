import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/minimize4_default.svg.txt!text';

export class Minimize4Icon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }