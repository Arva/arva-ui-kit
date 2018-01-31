import Easing from 'famous/transitions/Easing.js';

import {View} from 'arva-js/core/View.js';
import {limit} from 'arva-js/utils/Limiter.js'
import {combineOptions} from 'arva-js/utils/CombineOptions.js';

import {CarouselIndicators} from './CarouselIndicators.js';
import {layout, dynamic, bindings, flow, event} from 'arva-js/layout/Decorators.js';


/**
 *
 * Swipable Carousel that will align and control swiping between views or surfaces
 * Always uses the full width of the screen
 *
 * @param {Number} [options.startIndex]: index of initial component to show in the carousel
 * @param [Renderable] items: array of renderable constructors, with bound arguments
 *
 *
 */

const width = window.innerWidth;


@bindings.setup({
    showCarousel: true,
    activeIndex: 0,
    items: [],
    darkIndicators: false,
    _currentSize: [100, 0],
    sensitivity: 3
})
export class SwipableCarousel extends View {

    @bindings.trigger()
    gotoActiveIndex({activeIndex, _currentSize}) {
        if(this.wall){
            this.wall.draggable.setPosition([- activeIndex  * _currentSize[0], 0], {curve: Easing.outCubic, duration: 200});
        }
    }


    @event.on('end', function ({position, velocity}) {
        this._snapToClosestPoint(position[0], velocity[0]);
    })
    @dynamic(({items, _currentSize}) =>
        items.length > 1 && layout.draggable({projection: 'x'})
    )
    @layout.draggable({xRange: [0, ]}).size(undefined, undefined)
    wall = View.with({}, {
        @layout.dock.left(undefined)
        items: this.options.items.map((item) =>
            item
        )
    });

    /* If there's only one item, exclude indicators */
    @layout.stick.bottom().translate(0, -2, 20).size(true, 30)
    indicators = this.options.items.length > 1 && CarouselIndicators.with({
        activeIndex: this.inputOptions.activeIndex,
        numberOfItems: this.options.items.length,
        dark: this.options.darkIndicators
    });


    _snapToClosestPoint(xPosition, xVelocity) {
        let newActiveIndex = - Math.round((xPosition)/ this.options._currentSize[0]);
        if(newActiveIndex === this.options.activeIndex){
            let {sensitivity} = this.options;
            if(xVelocity > sensitivity){
                this.options.activeIndex--;
            } else if(xVelocity < - sensitivity){
                this.options.activeIndex++;
            }
        } else {
            this.options.activeIndex = newActiveIndex
        }
        this.options.activeIndex = Math.min(Math.max(this.options.activeIndex, 0), this.options.items.length - 1);
        this.gotoActiveIndex();
    }

    constructor(options, extraRenderables) {
        super(options, extraRenderables);
        this.on('newSize', (newSize) => this.options._currentSize = newSize, {propagate: false});
    }

}
