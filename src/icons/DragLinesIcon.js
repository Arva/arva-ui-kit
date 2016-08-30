import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/dragLines_default.svg.txt!text';

export class DragLinesIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }