/**
 * Created by paulvanmotman on 30-01-17.
 */

import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/receive_task.svg!text';

export class ReceiveIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}