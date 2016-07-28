import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/iosshare_default.svg.txt!text';

export class IosshareIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }