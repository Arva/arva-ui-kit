import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/badge_default.svg.txt!text';

export class BadgeIcon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }