/**
 * Created by lundfall on 12/07/16.
 */
import ImageSurface         from 'famous/Surfaces/ImageSurface.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import {layout}    from 'arva-js/layout/decorators.js';
import {Button}             from './Button.js';
import {Colors}             from '../defaults/DefaultColors.js';
import {TextButton}         from './TextButton.js';
import {ArrowleftIcon}      from '../icons/rounded/thin/ArrowleftIcon.js';

export class ImageButton extends Button {
    @layout.translate(0, 0, 30)
    @layout.size(function(size) {return size-this.options.imagePadding}, function(size) {return size-this.options.imagePadding})
    @layout.place('center')
    image = this.options.image ? new ImageSurface(this.options.image) : new this.options.icon({color: this.options.properties.color});

    /* Default if true size specified */
    getSize() {
        return [48, 48];
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
            imagePadding: 16,
            properties: {color: Colors.PrimaryUIColor},
            ...TextButton.generateBoxShadowVariations(options.variation)
        }, options));

    }

}
