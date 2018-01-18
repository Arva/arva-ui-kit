/**
 * Created by tom on 16/06/16.
 */

import {Surface}                        from 'arva-js/surfaces/Surface.js';
import {Colors}                         from '../../defaults/DefaultColors.js';
import {replaceColors}                  from './ReplaceColors.js';

export class BaseIcon extends Surface {

    static with(options) {
        return super.with({
            content: replaceColors(this.icon || options.icon, options.color || Colors.PrimaryUIColor),
            ...options
        })
    }

    changeColor(color) {
        let { options } = this;
        options.color = color;
        this.setContent(replaceColors(this.constructor.icon, color));
    }

}