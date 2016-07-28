import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/maximize_angular_bold.svg.txt!text';

 export class MaximizeIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}