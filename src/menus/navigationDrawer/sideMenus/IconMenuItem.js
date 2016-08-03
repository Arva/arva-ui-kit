/**
 * Created by rbu on 06-11-15.
 */
import Surface          from 'famous/core/Surface.js';

import {View}           from 'arva-js/core/View.js';
import {layout}         from 'arva-js/layout/Decorators.js';
import {combineOptions} from 'arva-js/utils/CombineOptions.js';
import {Button}         from '../../../buttons/Button.js';
import {Text}           from 'arva-kit/text/Text.js';


@layout.dockPadding(0, 0, 0, 16)
export class IconMenuItem extends Button {

    @layout.dock.left()
    @layout.size(24, 24)
    @layout.stick.center()
    icon = new this.options.icon({color: this.options.textColor});

    @layout.size(~30, undefined)
    @layout.dock.left()
    @layout.dockSpace(12)
    @layout.stick.center()
    text = new Text({
        content: this.options.text,
        properties: {
            color: this.options.textColor,
            pointerEvents: this.options.separation ? 'none' : 'initial'
        }
    });

    @layout.fullSize()
    clickOverlay = new Surface({
        properties: {
            pointerEvents: this.options.separation ? 'none' : 'initial'
        }
    });

    constructor(options = {}) {
        super(combineOptions(options, {
            makeRipple: true,
            useBoxShadow: false,
            delay: 0,
            backgroundProperties: {
                borderRadius: '0px'
            }
        }));

        this.layout.once('layoutstart', ({size: [_,height]}) => {
            this.text.setProperties({lineHeight: `${height}px`});
        });
    }

    setSelected(selected) {
        let color = selected ? this.options.highlightedTextColor : this.options.textColor;
        this.text.setProperties({color});
        this.icon.changeColor(color);
    }

    getSize() {
        return [undefined, this.options.separation ? 15 : 44];
    }

}