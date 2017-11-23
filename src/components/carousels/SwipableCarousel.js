
import Easing                       from 'famous/transitions/Easing.js';

import {View}                       from 'arva-js/core/View.js';
import {layout, flow}               from 'arva-js/layout/Decorators.js';
import { limit }                    from 'arva-js/utils/Limiter.js'
import { combineOptions }           from 'arva-js/utils/CombineOptions.js';

import { CarouselIndicators }       from './CarouselIndicators.js';


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


export class SwipableCarousel extends View {

    @layout.stick.center()
    @layout.size(undefined, true)
    wall = new CarouselWall(this.options);

    @layout.stick.bottom(true)
    @layout.size(undefined, 48)
    carouselIndicators = this.options.showCarousel && new CarouselIndicators({
        numberOfPages: this.options.items.length,
        showButtons: false,
        ...this.options.carouselIndicatorProperties
    });

    constructor(options={}){
        super(combineOptions({
            showCarousel: true,
            carouselIndicatorProperties: {
                variation: 'transparent-light'
            },
            itemHeight: true,
            sensitivity: 'high',
            isSwipable: true
        },options));

        this.carouselIndicators && this.carouselIndicators.setIndex(this.options.startIndex);
        this.wall.on('change-index', (idx) => {
            this.carouselIndicators && this.carouselIndicators.setIndex(idx);
        })
    }

    swipe(next=true){
        this.wall.swipe(next)
    }

    goToIndex(idx){
        this.wall.goToIdx(idx)
    }

    getActiveIndex(){
        return this.wall.focusedItem;
    }
}

class CarouselWall extends View {


    constructor(options = {}) {
        super(options);
        this.focusedItem = this.options.startIndex;



        this.items = [];

        this.swipableOptions = {
            projection: ['x']
        };


        this.createItems();
        this.addDragEventListener(this.focusedItem);

        if(this.focusedItem !== 0){
            this.goToIdx(this.focusedItem, 0);
        }

        if (this.options.sensitivity === 'low'){
            this.swipeSensitivity = 0.5
        } else if (this.options.sensitivity === 'medium'){
            this.swipeSensitivity = 0.35;
        } else {
            this.swipeSensitivity = 0.2;
        }
    }

    replaceItem(idx, renderable){
        let previousName =`item-${idx}`;
        this.replaceRenderable(previousName, renderable);
        this.decorateRenderable(previousName, layout.draggable(this.swipableOptions));
        renderable.draggable.on('update', ({position}) => {
            this.moveItems(position)
        });
        this.addDragEventListener(idx);

    }

    createItems(items){
        items ? items.forEach(this.createItem) : this.options.items.forEach(this.createItem);
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

        this._determineSwipeEvents(x, y, data.velocity[0])
    }

    createItem(boundItemConstructor, idx){
        let item = new boundItemConstructor();

        let decorators =[
            layout.stick.top(),
            layout.size(width, this.options.itemHeight),
            layout.translate(idx * width, 0, 0),
            layout.draggable(this.swipableOptions)
        ];

        this.addRenderable(item, `item-${idx}`, ...decorators);

        if (!this.options.isSwipable){
            item.draggable.deactivate();
        }
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
        this._eventOutput.emit('change-index', this.focusedItem);
        this.addDragEventListener(this.focusedItem);
    }

    goToIdx(idx, duration = 300){
        this.focusedItem = idx;
        this._eventOutput.emit('swipeIdx', idx);
        this.moveItems([-width * idx, 0], {duration});
    }



    _determineSwipeEvents(endX = 0, endY = 0, velocity) {
        let xThreshold = this.swipableOptions.xThreshold || [undefined, undefined];

        // normalise the displacement based on the current index
        endX = endX + (width * this.focusedItem);
        if (velocity > this.swipeSensitivity && this.focusedItem > 0){
            this.swipe(false)
        } else if (velocity < -this.swipeSensitivity && this.focusedItem < this.options.items.length -1){
            this.swipe(true);
        } else if (endX > xThreshold[1] && this.focusedItem > 0) {
            this.swipe(false);
        } else if (endX < xThreshold[0] && this.focusedItem < this.options.items.length-1) {
            this.swipe(true);
        } else {
            this.goToIdx(this.focusedItem);
        }
    }
}
