
import {View}                   from 'arva-js/core/View.js';
import {layout, flow}           from 'arva-js/layout/Decorators.js';
import BkImageSurface           from 'famous-bkimagesurface/BkImageSurface.js'
import { SwipableCarousel }     from './SwipableCarousel.js';

export class Cover extends View {
    @layout.stick.center()
    @layout.fullSize()
    background = new BkImageSurface({
        content:this.options.placeholder,
        sizeMode: 'cover',
        ...this.options.imageOptions
    });

    @layout.stick.center()
    @layout.fullSize()
    image = new BkImageSurface({
        content:this.options.url,
        sizeMode: this.options.sizeMode || 'cover',
        ...this.options.imageOptions
    });

    constructor(options={}) {
        super(options)

        console.log(this.image)
    }
}

export class SwipableImageCarousel extends SwipableCarousel {
    constructor(options={}){
        options.items = options.images.map( url =>
            Cover.bind(this, {
                url: url,
                placeholder:options.placeholder,
                sizeMode: 'cover',
                imageOptions: options.imageOptions
            })
        );

        super(options);
    }

}
