import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/new3_angular_thin.svg.txt!text';

 export class New3Icon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}