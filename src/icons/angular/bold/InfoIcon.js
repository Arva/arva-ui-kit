import {BaseIcon}        from '../../BaseIcon.js';
import iconImage         from '../../resources/info_angular_bold.txt';

export class InfoIcon extends BaseIcon {
    constructor(options) {
        super({...options, icon: iconImage});
    }
}