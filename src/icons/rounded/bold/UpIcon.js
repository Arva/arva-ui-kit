import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/up_rounded_bold.svg.txt!text';

 export class UpIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}