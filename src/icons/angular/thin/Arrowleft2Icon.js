import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/arrowleft2_angular_thin.svg.txt!text';

 export class Arrowleft2Icon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}