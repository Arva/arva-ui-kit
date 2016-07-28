/**
 * Created by tom on 16/06/16.
 */

import Surface                          from 'famous/core/Surface.js';
import {IconColor}                      from '../../defaults/DefaultColors.js';
import {replaceColors}                  from './ReplaceColors.js';

export class BaseIcon extends Surface {
    constructor(options = {}){
        super({
           content: replaceColors(options.icon, options.color || IconColor),
            ...options
        });
    }
}