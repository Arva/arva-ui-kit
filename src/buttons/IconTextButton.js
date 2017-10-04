/**
 * Created by tom on 20/01/2017.
 */

import Surface                      from 'famous/core/Surface.js';
import ImageSurface                 from 'famous/surfaces/ImageSurface.js';

import {View}                       from 'arva-js/core/View.js';
import {layout, dynamic, bindings}  from 'arva-js/layout/Decorators.js';
import {combineOptions}             from 'arva-js/utils/CombineOptions.js';

import {Button}                     from './Button.js';
import {Colors}                     from '../defaults/DefaultColors.js';


@bindings.setup({
    properties: {color: Colors.PrimaryUIColor},
    iconProperties:{
        width:48,
        height:48
    }
})
export class IconTextButton extends Button {

    @layout.stick.center()
    @layout.size(~100, undefined)
    @layout.translate(0, 0, 30)
    iconAndText = IconAndText.with(this.options);

    _setEnabled(enabled) {
        super._setEnabled(enabled);
        if(this.iconAndText.icon && this.iconAndText.icon.changeColor) {
            this.iconAndText.icon.changeColor(enabled ? this.options.backgroundProperties.backgroundColor : Colors.Gray);
        }
    }
}


@bindings.setup({
    image: false,
    iconProperties: {width: 0, height: 0},
    _iconPadding: 0
})
class IconAndText extends View {

    @bindings.preprocess()
    estimateIconPadding() {
        this.options._iconPadding = -(this.options.iconProperties.width - 24.0)/2.0;
    }

    @layout.translate(0, 0, 50)
    @layout.dock.left()
    @dynamic(({iconProperties, _iconPadding }) =>
        layout.size(iconProperties.width, iconProperties.height).translate(_iconPadding, 0, 50)
    )
    @layout.stick.left()
    icon = this.options.image ? ImageSurface.with({ content: this.options.image }) : this.options.icon.with({color: this.options.properties.color});

    @dynamic(({_iconPadding}) =>
        layout.translate(_iconPadding, 0, 30)
    )
    @layout.dockSpace(16)
    @layout.dock.left()
    @layout.size(~100, ~16)
    @layout.stick.left()
    text = new Surface(this.options);

}