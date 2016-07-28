import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/duplicate_rounded_thin.svg.txt!text';

export class DuplicateIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }