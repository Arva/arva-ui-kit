import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/list_rounded_bold.svg.txt!text';

 export class ListIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}