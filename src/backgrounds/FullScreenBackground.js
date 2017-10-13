/**
 * Created by Manuel on 08/07/16.
 */
import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import Surface              from 'arva-js/famous/core/Surface.js';

export class FullScreenBackground extends View {

    @layout.fullSize()
    background = new Surface({properties: {'background-color':this.options.color}});

    constructor(options = {}){
        super(options);
    }

}