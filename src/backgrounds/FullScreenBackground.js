/**
 * Created by Manuel on 08/07/16.
 */
import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/decorators.js';
import Surface              from 'famous/core/Surface.js';

export class FullScreenBackground extends View {

    @layout.fullscreen
    background = new Surface({properties: {'background-color':this.options.color}});

    constructor(options = {}){
        super(options);
    }

}