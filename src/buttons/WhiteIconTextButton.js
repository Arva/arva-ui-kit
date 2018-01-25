/**
 * Created by Manuel on 19/07/16.
 * Revision by Karl 18/01/18
 */

import Surface from 'famous/core/Surface.js';
import ImageSurface from 'famous/surfaces/ImageSurface.js';

import {View} from 'arva-js/core/View.js';
import {combineOptions} from 'arva-js/utils/CombineOptions.js';
import {layout, bindings, dynamic} from 'arva-js/layout/Decorators.js';

import {Colors} from '../defaults/DefaultColors.js';
import {UIButtonPrimary} from '../defaults/DefaultTypefaces.js';

import {Button} from './Button.js';
import {AccountIcon} from '../icons/AccountIcon';

@layout.dockPadding(0, 24, 0, 24)
@dynamic(() =>
    bindings.setup({
        enabledColor: Colors.PrimaryUIColor,
        disabledColor: Colors.Gray,
        textProperties: UIButtonPrimary.properties,
        icon: AccountIcon,
        text: 'Go',
        iconColor: Colors.PrimaryUIColor,
        center: true
    })
)
export class WhiteIconTextButton extends Button {


    @bindings.trigger()
    setEnabledStyle() {
        this.options.textProperties.color = this.options.iconColor =
            this.options.enabled ? this.options.enabledColor :
                this.options.disabledColor;
    }

    @layout.stick.center()
    @dynamic(({center}) =>
        center ? layout
                .size(true, true)
                .dock.fill()
            :
            layout
                .columnDockPadding(320, [0, 32])
                .dock.fill()
                .size(undefined, true)
    )
    iconAndText = View.with({}, {
            @layout
                .dock.left(28)
                .size(24, 24)
                .stick.left()
            icon: this.options.image ?
                ImageSurface.with({content: this.options.image}) :
                this.options.icon.with({color: this.options.iconColor}),
            @layout
                .dock.fill()
                .size(~100, ~16)
                .stick.left()
            text: Surface.with({
                content: this.options.text,
                properties: this.options.textProperties
            })
        }
    );

}