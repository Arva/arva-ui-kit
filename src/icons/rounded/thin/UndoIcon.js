import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/undo_rounded_thin.svg.txt!text';

 export class UndoIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}