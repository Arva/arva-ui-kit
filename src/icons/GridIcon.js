import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/grid_default.svg.txt!text';

export class GridIcon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }