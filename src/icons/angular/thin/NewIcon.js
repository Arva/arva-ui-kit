import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/new_angular_thin.svg.txt!text';

 export class NewIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}