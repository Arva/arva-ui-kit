import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/redo_rounded_bold.svg.txt!text';

 export class RedoIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}