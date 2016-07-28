import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/minimize3_angular_thin.svg.txt!text';

 export class Minimize3Icon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}