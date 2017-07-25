
import Surface              from 'famous/core/Surface.js';

import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';


export class Overlay extends View {

    @layout.fullSize()
    background = new Surface(this.options);
    
    constructor(options = {}){
        super(combineOptions({
            properties:{
                backgroundColor: 'rgba(0,0,0,0.4)'
            }
        },options));
    }

}