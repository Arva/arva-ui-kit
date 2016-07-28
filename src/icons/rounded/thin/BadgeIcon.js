import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/badge_rounded_thin.svg.txt!text';

 export class BadgeIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}