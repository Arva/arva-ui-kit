import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/maximize4_rounded_thin.svg.txt!text';

 export class Maximize4Icon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}