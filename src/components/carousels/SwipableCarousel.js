import Easing                       from 'famous/transitions/Easing.js';

import {View}                       from 'arva-js/core/View.js';
import {layout, flow}               from 'arva-js/layout/Decorators.js';
import BkImageSurface               from 'famous-bkimagesurface/BkImageSurface.js'
// import {LoadingPlaceholderImage}    from '../placeholders/LoadingPlaceholderImage.js';
// import {LoadingSpinnerSquares}      from '../loaders/LoadingSpinnerSquares.js';

import { PageCarousel }             from '../Carousel.js';
import { limit }                    from 'arva-js/utils/Limiter.js'



/**
 * @param Number startIndex: index of initial component to show in the carousel
 * @param [Constructor] items: array of constructors for creating the elements
 *
 */

const width = window.innerWidth;

export class SwipableCarousel extends View {

    @layout.stick.center()
    @layout.size(undefined, undefined)
    wall = new CarouselWall(this.options);

    // TODO: adapt this to be transparent, change the name of the component, etc.
    @layout.stick.bottom(true)
    @layout.size(undefined, 48)
    carouselIndicators = new PageCarousel({numberOfPages: this.options.items.length});

    constructor(options={}){
        super(options);
        this.carouselIndicators.setIndex(this.options.startIndex)
    }
}

class CarouselWall extends View {

    constructor(options = {}) {
        super(options);
        this.focusedItem = 0;
        this.items = [];
        this.createItems();
        this.swipeListener = this.swipeListener.bind(this);
        this.addDragEventListener(this.focusedItem);

        this.swipableOptions = {
            yRange: [0, 0],
            xRange: [-width / 2, width / 2],
            snapX: false,
            xThreshold: [-150, 150]
        };

        this.createXThresholds()
    }

    createXThresholds(){
        this.xThresholds = {};
        let [negThreshold, posThreshold] = this.swipableOptions.xThreshold;
        this.options.items.forEach( (elt, idx) => {
            this.xThresholds[idx] = [idx * width + negThreshold, idx * width + posThreshold];
        });
    }

    createItems(){
        this.options.items.forEach(this.createItem.bind(this))
    }

    addDragEventListener(idx){
        let item = this[`item-${idx}`];
        item && item.draggable.on('end', this.swipeListener);
    }

    removeDragEventListener(idx){
        let item = this[`item-${idx}`];
        item && item.draggable.removeListener('end')
    }

    swipeListener({data, position}){
        let [x, y] = position;

        data.velocity[0] = Math.abs(data.velocity[0]) < 0.5 ? data.velocity[0] * 2 : data.velocity[0];

        this.moveItems([x, y], {
            curve: Easing.outCirc,
            duration: (750 - Math.abs((data.velocity[0] * 150)))
        });

        this._determineSwipeEvents(x, y)
    }

    createItem(boundItemConstructor, idx){
        let item = new boundItemConstructor();

        let decorators =[
            layout.stick.center(),
            layout.size(width,undefined),
            layout.translate(idx * width, 0, 0),
            layout.draggable(this.swipableOptions)
        ];

        this.addRenderable(item, `item-${idx}`, ...decorators);

        item.draggable.on('update', ({position}) => {
            this.moveItems(position)
        });

        this[`item-${idx}`] = item;
    }

    moveItems([xPos, yPos], {duration, curve} = {}){
        duration = duration || 0;
        curve = curve || Easing.outCirc;
        this.options.items.forEach( (itemUrl, idx) => {
            this[`item-${idx}`].draggable.setPosition([xPos, 0, 0], {duration, curve})
        })
    }

    swipe(next=true) {
        this.removeDragEventListener(this.focusedItem);
        if (next) {
            this.focusedItem ++;
        }  else {
            this.focusedItem --;
        }

        this.goToIdx(this.focusedItem);
        this.addDragEventListener(this.focusedItem);
    }

    goToIdx(idx){
        this.moveItems([-width * idx, 0], {duration: 300});
    }

    _determineSwipeEvents(endX = 0, endY = 0) {
        let xThreshold = this.swipableOptions.xThreshold || [undefined, undefined];

        // normalise the displacement based on the current index
        endX = endX + (width * this.focusedItem);

        if (endX > xThreshold[1] && this.focusedItem > 0) {
            this.swipe(false)
        } else if (endX < xThreshold[0] && this.focusedItem < this.options.items.length-1) {
            this.swipe(true);
        } else {
            this.goToIdx(this.focusedItem);
        }
    }
}
