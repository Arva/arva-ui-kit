import {BaseIcon}                  from '../../BaseIcon.js';
import iconImage                   from '../../resources/arrowleft_angular_bold.txt';

export class ArrowleftIcon extends BaseIcon {
    constructor(options) {
        super({...options, icon: iconImage});
    }
}