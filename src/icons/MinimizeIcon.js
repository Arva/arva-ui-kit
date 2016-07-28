import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/minimize_rounded_thin.svg.txt!text';

export class MinimizeIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }