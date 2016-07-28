import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/tabs_angular_thin.svg.txt!text';

 export class TabsIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}