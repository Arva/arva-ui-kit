/**
 * Created by Manuel on 09/09/16.
 */
import {layout}                             from 'arva-js/layout/Decorators.js';
import {combineOptions}                     from 'arva-js/utils/CombineOptions.js';

import FlexTabBar                           from 'famous-flex/widgets/TabBar.js';
import {Tab}                                from './Tab.js';

export let DockLeftLayout = {
    _calcCurrentPosition(id){
        let position = 0;
        for (let index = 0; index < this._itemCount; index++) {
            if (index == id) {
                return position;
            }
            position += this[`item${index}`].getSize()[0] || 0;
        }
    },
    _getCurrentSize(index){
        let size = this[`item${index}`].getSize()[0] || 0;
        return size;
    },
    _setItems(items) {
        this.items = items;

        for (let index in items) {
            this._itemCount++;

            if(!items[index].clickEventData){
                items[index].clickEventData = [index, items[index]];
            }
            let tab = new (this.options.tabRenderable || Tab)(combineOptions(this.options.tabOptions, items[index] || {}));
            this._registerTabListeners(tab, index);
            this.addRenderable(tab, `item${index}`, layout.dock.left(~50))
        }
    },
    _handleItemActive(id, tab) {
        this._currentItem = id;
        this.setItemActive(id, tab);
        for (let index = 0; index < this._itemCount; index++) {
            let item = this[`item${index}`];
            if (index == parseInt(id)) {
                item && item.setActive && item.setActive();
                continue;
            }

            item && item.setInactive && item.setInactive();
        }
    },
    getItem(index){
        return this[`item${index}`] || {}
    }
};

export let EqualSizeLayout = {
    _calcCurrentPosition(id){
        let size =  (this._getCurrentSize() * id) + (this.options.shapeWidth ? (this._getCurrentSize()/2 - this.options.shapeWidth/2) : 0);
        return size;
    },
    _getCurrentSize(){
        let size = this._width / this._itemCount;
        return size;
    },
    _setItems(items) {
        this.items = items;
        this.addRenderable(new FlexTabBar({
            createRenderables: {
                item: (id, data) => {
                    if(!data.clickEventData){
                       data.clickEventData = [this._itemCount, data];
                    }
                    let tab = new this.options.tabRenderable(combineOptions(this.options.tabOptions, data || {}));
                    this._registerTabListeners(tab, this._itemCount);
                    this._itemCount++;
                    return tab;
                }
            }
        }), 'tabBar', layout.dock.fill());
        this.tabBar.setItems(items);
    },
    _handleItemActive(id, tab) {
        this._currentItem = id;
        this.setItemActive(id, tab);
        let items = this.tabBar.getItems();
        for (let index in items) {
            let item = items[index];
            if (index == parseInt(id)) {
                item && item.setActive && item.setActive();
                continue;
            }

            item && item.setInactive && item.setInactive();
        }
    },
    getItem(index){
        return this.tabBar.getItems()[index] || {};
    }
};
