/**
 * Created by Manuel on 19/07/16.
 */

import Surface                  from 'famous/core/Surface.js';
import ImageSurface             from 'famous/Surfaces/ImageSurface.js';
import {layout}                 from 'arva-js/layout/Decorators.js';

import {Button}                 from './Button.js';

export class IconButton extends Button {

    @layout.translate(20, 0, 50)
    @layout.dock('left')
    @layout.size(24, 24)
    @layout.align(0,0.5)
    @layout.origin(0,0.5)
    icon = this.options.image ? new ImageSurface({ content: this.options.image }) : new this.options.icon({color: this.options.properties.color});

    @layout.translate(32, 0, 30)
    @layout.dock('left')
    @layout.size(0.8, ~16)
    @layout.align(0,0.5)
    @layout.origin(0,0.5)
    text = new Surface(this.options);
    
    setContent(iconConstructor) {
        this.icon.setContent(new iconConstructor({color: this.options.properties.color}).getContent());
    }

}