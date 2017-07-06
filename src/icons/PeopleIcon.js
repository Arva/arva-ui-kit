import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/people_default.svg.txt!text';

export class PeopleIcon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }