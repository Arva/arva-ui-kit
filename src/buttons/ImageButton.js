/**
 * Created by lundfall on 12/07/16.
 */
import {layout}                             from 'arva-js/layout/Decorators.js';
import {combineOptions}                     from 'arva-js/utils/CombineOptions.js';
import ImageSurface                         from 'famous/Surfaces/ImageSurface.js';

import {Button}                             from './Button.js';
import {TextButton}                         from './TextButton.js';
import {Colors}                             from '../defaults/DefaultColors.js';
import {ArrowleftIcon}                      from '../icons/rounded/thin/ArrowleftIcon.js';
import {ComponentHeight,
        ComponentPadding}                   from '../defaults/DefaultDimensions.js';


export class ImageButton extends Button {
    @layout.translate(0, 0, 30)
    @layout.dock.fill()
    image = this.options.image ? new ImageSurface({content: this.options.image}) : new this.options.icon({color: this.options.properties.color});
    
    /* Default if true size specified */
    getSize() {
        return [ComponentHeight, ComponentHeight];
    }

    constructor(options = {}) {
        if (!options.image && !options.icon) {
            options.icon = ArrowleftIcon;
        }
        if (options.imageOnly) {
            options.backgroundProperties = {...options.backgroundProperties, backgroundColor: 'none'};
            options.variation = 'noShadow';
        }
        super(combineOptions({
            properties: {color: Colors.PrimaryUIColor},
            ...TextButton.generateBoxShadowVariations(options.variation)
        }, options));
    }

    setContent(iconConstructor) {
        this.image.setContent(new iconConstructor({color: this.options.properties.color}).getContent());
    }
}
