import Easing                   from 'famous/transitions/Easing.js';

import {View}                   from 'arva-js/core/View.js';
import {layout, flow}           from 'arva-js/layout/Decorators.js';
import BkImageSurface           from 'famous-bkimagesurface/BkImageSurface.js'
// import {LoadingPlaceholderImage}from '../placeholders/LoadingPlaceholderImage.js';
// import {LoadingSpinnerSquares}  from '../loaders/LoadingSpinnerSquares.js';

import { limit }                from 'arva-js/utils/Limiter.js'

import { SwipableCarousel }     from './SwipableCarousel.js';


export class SwipableImageCarousel extends SwipableCarousel {
    constructor(options={}){
        options.items = options.images.map( url =>
            BkImageSurface.bind(this, {
                content: url,
                ...options.imageOptions
            })
        );

        super(options);
    }

}
