/**
 * Created by tom on 20/01/2017.
 */

/**
 * Created by Manuel on 19/07/16.
 */

import Surface                  from 'famous/core/Surface.js';
import ImageSurface             from 'famous/surfaces/ImageSurface.js';

import {View}                   from 'arva-js/core/View.js';
import {layout}                 from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';

import {Button}                 from './Button.js';
import {Colors}                 from '../defaults/DefaultColors.js';

export class IconTextButton extends Button {

    @layout.stick.center()
    @layout.size(~100, undefined)
    @layout.translate(0, 0, 30)
    iconAndText = new IconAndText(this.options);

    constructor(options = {}){
        super(combineOptions({
            properties: {color: Colors.PrimaryUIColor},
            iconProperties:{
                width:48,
                height:48
            }
        }, options));
    }


    _setEnabled(enabled) {
        super._setEnabled(enabled);
        if(this.iconAndText.icon && this.iconAndText.icon.changeColor) {
            this.iconAndText.icon.changeColor(enabled ? this.options.backgroundProperties.backgroundColor : Colors.Gray);
        }
    }
}

class IconAndText extends View {

    @layout.translate(0, 0, 50)
    @layout.dock.left()
    @layout.size(24, 24)
    @layout.stick.left()
    icon = this.options.image ? new ImageSurface({ content: this.options.image }) : new this.options.icon({color: this.options.properties.color});

    @layout.translate(0, 0, 30)
    @layout.dockSpace(16)
    @layout.dock.left()
    @layout.size(~100, ~16)
    @layout.stick.left()
    text = new Surface(this.options);

    constructor(options = {}) {
        super(options);

        let iconFudge = -(this.options.iconProperties.width - 24.0)/2.0;
        this.decorateRenderable('icon', layout.size(this.options.iconProperties.width, this.options.iconProperties.height));
        this.decorateRenderable('icon', layout.translate(iconFudge, 0, 50));
        this.decorateRenderable('text', layout.translate(iconFudge, 0, 30));
    }
}