/**
 * Created by lundfall on 12/07/16.
 */
import ImageSurface         from 'famous/Surfaces/ImageSurface.js';
import {View}               from 'arva-js/core/View.js';

import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import {layout, options}    from 'arva-js/layout/decorators.js';
import {Button}             from './Button.js';
import {UIButtonPrimary}    from '../../defaults/DefaultTypefaces.js';

import {ArrowleftIcon}      from '../../icons/rounded/thin/ArrowleftIcon.js';

export class ImageButton extends Button {
    @layout.translate(0, 0, 30)
    @layout.dock('top')
    @layout.size(~300, ~30)
    @layout.place('center')
    image = this.options.image ? new ImageSurface(this.options.image) : new this.options.icon();


    constructor(options){
        if(!options.image && !options.icon){
            options.icon = ArrowleftIcon;
        }
        super(combineOptions({}, options));

    }

}
