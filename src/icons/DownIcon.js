import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/down_default.svg.txt!text';

export class DownIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }