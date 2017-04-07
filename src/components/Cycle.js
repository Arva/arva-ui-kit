/**
 * Created by chrwc on 2017-03-24.
 */

import {View}                       from 'arva-js/core/View.js';
import {layout, event}              from 'arva-js/layout/Decorators.js';
import {combineOptions}             from "arva-js/utils/CombineOptions";

/************
 * Positions a group of uniform sized elements centered with uniform spacing in-between each other
 ***********/

@layout.flow()
export class Cycle extends View {

    /**
     *
     * @param {Object[]} renderables - Array of renderables to place within the component
     * @param {Function} renderables[].renderable
     * @param {String} renderables[].renderableName
     * @param {Array} renderables[].decorators - Array of decorator functions to apply to the renderable
     */

    setRenderables(renderables) {
        let count = renderables.length;
        let center = ((count+1)/2) - 1;

        for (let i = 0; i < count; i++) {
            let renderable = renderables[i];

            if (!renderable.decorators) renderable.decorators = [];

            let offset = (center-i)*(this.options.width + this.options.spacing);
            this.addRenderable(renderable.renderable,
                renderable.renderableName,
                layout.stick.center(),
                layout.size(this.options.width, this.options.height),
                layout.translate(offset*this.options.direction[0],offset*this.options.direction[1],offset*this.options.direction[2]),
                ...renderable.decorators
            )
        }
    }

    constructor(options) {
        super(combineOptions({
            spacing:8,
            height:64,
            width:64,
            direction:[-1, 0, 0]
        }, options))

    }
}