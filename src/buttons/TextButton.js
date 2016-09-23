/**
 * Created by lundfall on 12/07/16.
 */

import Surface                  from 'famous/core/Surface.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {layout}                 from 'arva-js/layout/Decorators.js';
import {Button}                 from './Button.js';
import {UIButtonPrimary}        from '../defaults/DefaultTypefaces.js';
import {Colors}                 from '../defaults/DefaultColors.js';
import {ComponentHeight}        from '../defaults/DefaultDimensions.js';

export class TextButton extends Button {
    @layout.translate(0, 0, 30)
    @layout.dock.top()
    @layout.size(~300, undefined)
    @layout.origin(0.5, 0)
    @layout.align(0.5, 0)
    text = new Surface(this.options);

    constructor(options = {}) {
        super(combineOptions({
            disabledOptions: {
                content: options.content,
                properties: {
                    color: Colors.ModestTextColor
                }
            },
            properties: {...UIButtonPrimary.properties, color: Colors.PrimaryUIColor},
            ...TextButton.generateBoxShadowVariations(options.variation, options.disableBoxShadow)
        }, options));
        this.layout.on('layoutstart', ({size}) => {
            let newLineHeight = size[1] + 'px';
            let {text} = this;
            if (text.getProperties().lineHeight !== newLineHeight) {
                text.setProperties({
                    lineHeight: newLineHeight
                });
            }
        });
    }

    getSize() {
        let actualSize = super.getSize();
        return [actualSize[0], ComponentHeight];
    }

    setColor(color) {
        this.text.setProperties({color});
    }

    setContent(value) {
        this.text.setContent(value);
    }

    _setEnabled(enabled) {
        super._setEnabled(enabled);
        let options = enabled ? this.options : this.options.disabledOptions;
        this.text.setProperties(options.properties);
        this.text.setContent(options.content);
    }

    static generateBoxShadowVariations(variation, disableBoxShadow) {
        return {
            useBoxShadow: (variation === 'noShadow' || disableBoxShadow) ? false : true,
            boxShadowType: variation
        }
    }
}