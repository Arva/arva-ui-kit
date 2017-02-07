/**
 * Created by tom on 27/07/16.
 */
import Easing                   from 'famous/transitions/Easing';
import ImageSurface             from 'famous/surfaces/ImageSurface.js';
import AnimationController      from 'famous-flex/AnimationController.js';
import BkImageSurface           from 'famous-bkimagesurface/BkImageSurface.js';
import {View}                   from 'arva-js/core/View.js';
import {layout}                 from 'arva-js/layout/Decorators';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';

import placeholderImage         from './resources/imagePlaceholder.png!arva-js/utils/ImageLoader.js';

export class LoadingPlaceholderImage extends View {

    /** @enum {String}
     * Values are:
     * AUTO -> 'auto',
     * FILL -> '100% 100%',
     * ASPECTFILL -> 'cover',
     * ASPECTFIT -> 'contain'
     */
    static SizeMode = BkImageSurface.SizeMode;

    /** @enum {String}
     * Values are:
     * CENTER: 'center center',
     * LEFT: 'left center',
     * RIGHT: 'right center',
     * TOP: 'center top',
     * BOTTOM: 'center bottom',
     * TOPLEFT: 'left top',
     * TOPRIGHT: 'right top',
     * BOTTOMLEFT: 'left bottom',
     * BOTTOMRIGHT: 'right bottom'
     */
    static PositionMode = BkImageSurface.PositionMode;

    @layout.fullSize()
    @layout.translate(0, 0, 10)
    @layout.animate({
        showInitially: false,
        animation: AnimationController.Animation.Fade,
        transition: {duration: 200, curve: Easing.linear}
    })
    image = new BkImageSurface({
        content: this.options.content, sizeMode: this.options.sizeMode, positionMode: this.options.positionMode,
        properties: this.options.imageProperties
    });

    @layout.fullSize()
    @layout.translate(0, 0, 20)
    placeholder = new BkImageSurface({content: this.options.placeholderContent, sizeMode: this.options.sizeMode, properties: this.options.placeholderProperties});

    /**
     * A view that loads a given external image into a BkImageSurface, overlays a placeholder image on top of it,
     * and animates away the placeholder once the given image has finished loading.
     *
     * @param {Object} options Construction options
     * @param {String} options.content The URL of the external image to show
     * @param {String} [options.sizeMode] How to stretch the external image in its container. Valid values in LoadingPlaceholderImage.SizeMode.
     * Defaults to LoadingPlaceholderImage.SizeMode.ASPECTFILL
     * @param {String} [options.positionMode] How to position the external image in its container. Valid values in LoadingPlaceholderImage.SizeMode.
     * Defaults to LoadingPlaceholderImage.PositionMode.CENTER
     * @param {String} [options.imageProperties] The properties to pass onto the image BkImageSurface.
     * @param {String} [options.placeholderContent] A URL to the image to use as a placeholder. Defaults to ./resources/placeholderImage.svg.
     * @param {String} [options.placeholderProperties] The properties to pass onto the placeholder BkImageSurface.
     */
    constructor(options = {}) {
        super(combineOptions({
            sizeMode: LoadingPlaceholderImage.SizeMode.ASPECTFILL,
            positionMode: LoadingPlaceholderImage.PositionMode.CENTER,
            imageProperties: {},
            placeholderContent: placeholderImage,
            placeholderProperties: {}
        }, options));

       if(options.content) {this._createImageElement(options.content)}
    }

    setContent(imageUrl = ''){
        this.placeholder.setProperties({display: 'block'});
        this.image.animationController.hide();
        this.image.setContent(imageUrl);
        this._createImageElement(imageUrl);
    }

    getContent() {
        return this.image.getContent();
    }

    _onImageLoad() {
        this.image.animationController.show(this.image, undefined, () => {
            delete this.imgElement;
            this.placeholder.setProperties({display: 'none'});
        });
    }

    _createImageElement(imageSrc = ''){
        this.imgElement = document.createElement('img');
        this.imgElement.onload = this._onImageLoad;
        this.imgElement.src = imageSrc
    }
}