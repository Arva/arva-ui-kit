/**
 * Created by tom on 16/06/16.
 */

import Surface                          from 'famous/core/Surface.js';
import {Colors}                         from '../../defaults/DefaultColors.js';
import {replaceColors}                  from './ReplaceColors.js';

export class BaseIcon extends Surface {
    constructor(options = {}){
        super({
           content: replaceColors(options.icon, options.color || Colors.PrimaryUIColor),
            ...options
        });
        this.options = options;
    }

    changeColor(color) {
        let {options} = this;
        options.color = color;
        this.setContent(replaceColors(options.icon, color));
    }
}