import {BaseIcon}					from '../../BaseIcon.js';
import iconImage					from '../../resources/minimize2_angular_thin.svg.txt!text';

export class Minimize2Icon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}