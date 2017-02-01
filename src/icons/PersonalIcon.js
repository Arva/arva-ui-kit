/**
 * Created by paulvanmotman on 01/02/2017.
 */

import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/personal.svg!text';

export class PersonalIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}