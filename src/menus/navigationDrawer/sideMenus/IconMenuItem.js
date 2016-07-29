/**
 * Created by rbu on 06-11-15.
 */
import Surface              from 'famous/core/Surface.js';

import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {AccountIcon}        from '../../../icons/AccountIcon.js';
import {Button}             from '../../../buttons/Button.js';

import {PrimaryUIColor}     from '../../../defaults/DefaultColors.js';
import {ModestTextColor}    from '../../../defaults/DefaultColors.js';
import {UIRegular}          from '../../../defaults/DefaultTypefaces.js';

@layout.dockPadding(0,0,0,12)
export class IconMenuItem extends Button {

    @layout.animate({showInitially: true, animation: null, show: {duration: 0}, hide: {duration: 0}})
    @layout.dock.left(24,12,50)
    icon = this.options.iconRenderable ? new this.options.iconRenderable({color: this.options.iconColor || PrimaryUIColor}) : new AccountIcon({color: this.options.iconColor || PrimaryUIColor});

    @layout.dockSpace(12)
    @layout.dock.left()
    @layout.translate(0,2,60)
    @layout.size(~30,~17)
    @layout.align(0,0.5)
    @layout.origin(0,0.5)
    textSurface = new Surface({
        content: this.options.text,
        properties: {
            color: this.options.colors.MenuTextColor,
            fontSize: UIRegular.properties.fontSize,
            fontFamily: UIRegular.properties.fontFamily,
            pointerEvents: this.options.separation ? 'none' : 'initial'

        }
    });

    constructor(options = {}, data = {}) {
        super(combineOptions(options, {
            makeRipple: true,
            useBoxShadow: false,
            delay: 0,
            backgroundProperties: {
                borderRadius: '0px'
            },
            colors: {
                MenuTextColor: PrimaryUIColor
            },
            text: data.text || '',
            separation: data.separation || 'none'
        }));

        this.data = data;
    }

    setSelected(selected) {
        this.renderables.textSurface.setProperties({color: selected ? this.options.colors.MenuTextColorHighlight : this.options.colors.MenuTextColor});
        this.hideRenderable('icon');
        this.replaceRenderable('icon', this.options.iconRenderable ? new this.options.iconRenderable({color: selected ? ModestTextColor : this.options.iconColor || PrimaryUIColor}) : new AccountIcon({color: selected ? ModestTextColor : this.options.iconColor || PrimaryUIColor}));
        this.showRenderable('icon');
    }

    getSize() {
        return [undefined, this.data.separation ? 15 : 44];
    }

}