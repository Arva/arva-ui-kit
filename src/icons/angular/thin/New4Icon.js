import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/new4_angular_thin.svg.txt!text';

 export class New4Icon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}