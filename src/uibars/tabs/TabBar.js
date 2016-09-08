/**
 * Created by Manuel on 07/09/16.
 */

import Surface              from 'famous/core/Surface.js';
import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import FlexTabBar from 'famous-flex/widgets/TabBar.js';
import {Tab}                from './Tab.js';


export class TabBar extends View {

    /* Number of items in the tabBar */
    itemCount = 0;

    /* Current active item */
    currentItem = 0;

    /* Current width of the TabBar */
    width = 0;

    constructor(options = {tabOptions: {}}) {
        super(combineOptions({}, options));

        this.on('newSize', ([width]) => {
            this.width = width;
        });

        let items = [
            'one',
            'two',
            'three',
            'foudsafasfasdfasdfasdfasfsadfr',
            'fief',
            'siz'
        ];

        for (let index in items) {
            this.itemCount++;
            let tab = new (this.options.tabRenderable || Tab)(combineOptions({
                content: items[index],
            }, this.options.tabOptions));
            tab.on('activate', this._handleItemActive.bind(this, index, tab));
            tab.on('hoverOn', this.onHover.bind(this, index, tab));
            tab.on('hoverOff', this.offHover.bind(this, index, tab));
            this.addRenderable(tab, `item${index}`, layout.dock.left(~50))
        }
    }

    _handleItemActive(id, tab){
        this.setItemActive(id, tab);
        for (let index = 0; index < this.itemCount; index++) {
            let item = this[`item${index}`];
            if(index == parseInt(id)){
                item && item.setActive && item.setActive();
                continue;
            }

            item && item.setInactive && item.setInactive();
        }
    }

    _calcCurrentPosition(id) {
        let position = 0;
        for (let index = 0; index < this.itemCount; index++) {
            if (index == id) {
                return position;
            }
            position += this[`item${index}`].getSize()[0] || 0;
        }
    }

    _getCurrentSize(id) {
        let size = this[`item${id}`].getSize()[0] || 0;
        return size;
    }

    onHover(id, item) {
        /* To be inherited */
    }

    offHover(id, item) {
        /* To be inherited */
    }

    setItemActive(id, item) {
        /* To be inherited */
    }

    setItemDeactive(id, item) {
        /* To be inherited */
    }
}