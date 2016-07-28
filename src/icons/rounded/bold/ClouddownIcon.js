import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/clouddown_rounded_bold.svg.txt!text';

 export class ClouddownIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}