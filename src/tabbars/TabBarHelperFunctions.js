/**
 * Created by Manuel on 09/09/16.
 */
import {layout}                             from 'arva-js/layout/Decorators.js';
import {combineOptions}                     from 'arva-js/utils/CombineOptions.js';

import FlexTabBar                           from 'famous-flex/widgets/TabBar.js';
import {Tab}                                from './Tab.js';

export let DockLeftLayout = {
    calcCurrentPosition(id, existingSizes){
        let position = 0;
        for(let [index, size = {}] of existingSizes.entries()){
            if (index === id){
                return position;
            }
            position += size.width || 0
        }
        return position;
    },
    getItem(index){
        return this[`item${index}`] || {}
    }
};

export let EqualSizeLayout = {
    calcCurrentPosition(id){
        let size =  (this._getCurrentSize() * id) + (this.options.shapeWidth ? (this._getCurrentSize()/2 - this.options.shapeWidth/2) : 0);
        return size;
    }
};
