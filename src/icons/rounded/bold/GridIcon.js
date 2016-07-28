import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/grid_rounded_bold.svg.txt!text';

 export class GridIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}