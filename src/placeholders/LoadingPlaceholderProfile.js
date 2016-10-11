/**
 * Created by tom on 27/07/16.
 */

import {combineOptions}                 from 'arva-js/utils/CombineOptions.js';
import {LoadingPlaceholderImage}        from './LoadingPlaceholderImage.js';

import profilePlaceholder               from './resources/profilePlaceholder.png!arva-js/utils/ImageLoader.js';

export class LoadingPlaceholderProfile extends LoadingPlaceholderImage {

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
    constructor(options) {
        super(combineOptions({
            imageProperties: {borderRadius: '50%'},
            placeholderContent: profilePlaceholder,
            placeholderProperties: {borderRadius: '50%'}
        }, options));
    }
}
