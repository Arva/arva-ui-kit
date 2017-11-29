
/**
 * Created by Manuel on 19/07/16.
 */

import Surface                  from 'famous/core/Surface.js';
import ImageSurface             from 'famous/surfaces/ImageSurface.js';

import {View}                   from 'arva-js/core/View.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {layout}                 from 'arva-js/layout/Decorators.js';

import {Colors}                 from '../defaults/DefaultColors.js';
import {UIButtonPrimary}        from '../defaults/DefaultTypefaces.js';

import {Button}                 from './Button.js';

@layout.dockPadding(0,24,0,24)
export class WhiteIconTextButton extends Button {

    @layout.dock.left(~100)
    @layout.size(~100, 48)
    iconAndText = new IconAndText(this.options);

    // TODO: able to change the text also
    setContent(iconConstructor) {
        this.icon.setContent(new iconConstructor({color: this.options.properties.color}).getContent());
    }

    constructor(options = {}){
        super(combineOptions({
            textProperties: {...UIButtonPrimary.properties, color: Colors.PrimaryUIColor},
            iconProperties: {color: Colors.PrimaryUIColor}
        }, options));
    }

    _setEnabled(enabled, changeBackGround = true, colorProperties = null) {
        super._setEnabled(enabled, changeBackGround, colorProperties ? colorProperties : null);
        if(this.iconAndText.icon && this.iconAndText.icon.changeColor && changeBackGround) {
            if (colorProperties) {
                this.iconAndText.icon.changeColor(enabled ? colorProperties.activeTextAndIconColor : colorProperties.inActiveTextAndIconColor);
            } else {
                this.iconAndText.icon.changeColor(enabled ? this.options.backgroundProperties.backgroundColor : Colors.Gray);
            }
        }
        if(this.iconAndText.text && changeBackGround) {
            if (colorProperties) {
                this.iconAndText.text.setProperties({color: enabled ? colorProperties.activeTextAndIconColor : colorProperties.inActiveTextAndIconColor});
            } else {
                this.iconAndText.text.setProperties({color: enabled ? this.options.backgroundProperties.backgroundColor : Colors.Gray});
            }
        }
    }
}

class IconAndText extends View {

    @layout.translate(0, 0, 50)
    @layout.dock.left()
    @layout.size(24, 24)
    @layout.align(0,0.5)
    @layout.origin(0,0.5)
    icon = this.options.image ? new ImageSurface({ content: this.options.image }) : new this.options.icon({color: this.options.iconProperties.color});

    @layout.translate(0, 0, 30)
    @layout.dock.left(true, 8)
    @layout.size(true, ~16)
    @layout.align(0,0.5)
    @layout.origin(0,0.5)
    text = new Surface({
        ...this.options,
        properties: this.options.textProperties,
    });
}