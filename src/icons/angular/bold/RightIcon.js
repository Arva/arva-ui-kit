import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/right_angular_bold.svg.txt!text';

 export class RightIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}