import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/minus_rounded_thin.svg.txt!text';

 export class MinusIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}