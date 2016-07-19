import {BaseIcon}					from '../../BaseIcon.js';
import iconImage					from '../../resources/tabs_angular_bold.svg.txt!text';

export class TabsIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}