/**
 * Created by rbu on 06-11-15.
 */
import Surface          from 'famous/core/Surface.js';

import {View}           from 'arva-js/core/View.js';
import {layout}         from 'arva-js/layout/Decorators.js';
import {combineOptions} from 'arva-js/utils/CombineOptions.js';
import {Button}         from '../../../buttons/Button.js';

import {PrimaryUIColor} from '../../../defaults/DefaultColors.js';
import {UIRegular}      from '../../../defaults/DefaultTypefaces.js';

export class IconMenuItem extends Button {

    @layout.size(undefined, true)
    @layout.stick.center()
    textSurface = new Surface({
        content: data.text,
        properties: {
            color: this.options.colors.MenuTextColor,
            fontSize: UIRegular.properties.fontSize,
            fontFamily: UIRegular.properties.fontFamily,
            lineHeight: `${this.options.sideMenuOptions.itemHeight-4}px`,
            pointerEvents: data.separation ? 'none' : 'initial'

        }
    });

    @layout.fullSize()
    clickOverlay = new Surface({
        properties: {
            pointerEvents: data.separation ? 'none' : 'initial'
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
            }
        }));
        this.data = data;
    }

    setSelected(selected) {
        this.renderables.textSurface.setProperties({color: selected ? this.options.colors.MenuTextColorHighlight : this.options.colors.MenuTextColor});
    }

    getSize() {
        return [undefined, this.data.separation ? 15 : 44];
    }

}