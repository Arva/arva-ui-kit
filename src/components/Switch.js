/**
 * Created by vlad on 30/08/16.
 */

import Surface              from 'famous/core/Surface.js';
import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {Clickable}          from './Clickable.js';

export class Switch extends Clickable {

    @layout.size(48, 48)
    @layout.stick.center()
    outerBox = new Surface({
        properties: {
            borderRadius: '4px',
            backgroundColor: 'rgb(170, 170, 170)'
        }
    });

    @layout.size(44, 30)
    @layout.stick.center()
    @layout.translate(0, 0, 20)
    innerBox = new Surface({
        properties: {
            borderRadius: '2px',
            backgroundColor: 'rgb(255, 255, 255)'
        }
    });

    constructor(options = {}) {
        super(combineOptions({
            content: 'hello world'
        }, options));
    }
}