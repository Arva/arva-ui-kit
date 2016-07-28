import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/more_rounded_thin.svg.txt!text';

 export class MoreIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}