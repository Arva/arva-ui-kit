import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/cross_angular_bold.svg.txt!text';

 export class CrossIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}