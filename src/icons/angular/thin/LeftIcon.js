import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/left_angular_thin.svg.txt!text';

 export class LeftIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}