/**
 * Created by tom on 28/07/16.
 */

import ContainerSurface                 from 'famous/surfaces/ContainerSurface.js';
import StateModifier                    from 'famous/modifiers/StateModifier.js';
import Easing                           from 'famous/transitions/Easing.js';
import Timer                            from 'famous/utilities/Timer.js';
import Transform                        from 'famous/core/Transform.js';
import Surface                          from 'famous/core/Surface.js';
import radians                          from 'degrees-radians';

import {View}                           from 'arva-js/core/View.js';
import {layout}                         from 'arva-js/layout/Decorators.js';
import {combineOptions}                 from 'arva-js/utils/CombineOptions.js';

import {Colors}                         from '../defaults/DefaultColors.js';

export class SquaresLoader extends View {
    static degrees = 180;
    static delayInBetween = 200;
    static transition = {duration: 400, curve: Easing.outCubic};
    
    active = false;

    /* Needs to be a ContainerSurface because we need to set a "perspective" property relative to a parent element. */
    @layout.stick.center()
    @layout.size(function (width){
        return this.options.loaderSize[0] || width;
    },
                function (height) {
        return this.options.loaderSize[1] || height;
    })
    container = new ContainerSurface();

    /**
     * A continuously animated loader renderables, which can be shown whilst waiting for e.g. data from
     * a remote location. A perfect use case is as the placeholderTemplate in a DataBoundScrollView.
     *
     * Automatically starts and stops its animation cycle when deployed into and recalled from the rendering tree.
     *
     * @example
     * @size(48, 48)
     * @layout.stick.center()
     * loader = new SquaresLoader();
     *
     * or
     *
     * new DataBoundScrollView({ placeholderTemplate: () => new SquaresLoader({ loaderSize: [48, 48] }) });
     *
     * @param {Object} [options] Construction options
     * @param {Array} [options.loaderSize] A list of [width, height] specifying the wanted size of the loader, used when not layouting through decorators.
     *                                      When using decorators, the SquaresLoader will default to taking up all the space it's decorated with.
     */
    constructor(options = {}) {
        super(combineOptions({loaderSize: [64, 64]},options));
        this.container.context.setPerspective(100);

        let surfaceProperties = {
            properties: {backgroundColor: Colors.PrimaryUIColor, perspective: '500px', backfaceVisibility: 'visible', '-webkit-backface-visibility': 'visible'}
        };
        this.squareOne = new Surface(surfaceProperties);
        this.squareTwo = new Surface(surfaceProperties);

        this.stateModOne = new StateModifier({proportions: [0.5, 0.5], origin: [1, 1], align: [0.5, 0.5]});
        this.stateModTwo = new StateModifier({proportions: [0.5, 0.5], origin: [0, 0], align: [0.5, 0.5]});

        this.container.add(this.stateModOne).add(this.squareOne);
        this.container.add(this.stateModTwo).add(this.squareTwo);
        
        this._animationLoop = this._animationLoop.bind(this);

        /* Cancel animations when the renderable is removed from the render tree. */
        this.container.on('deploy', () => { this.active = true; this._animationLoop(); });
        this.container.on('recall', () => { this.active = false; });
    }

    getSize() {
        return [undefined, undefined];
    }

    async _animationLoop() {
        this.stateModOne.setOrigin([1, 1]);
        this.stateModTwo.setOrigin([0, 0]);
        this.stateModOne.setTransform(Transform.identity);
        this.stateModTwo.setTransform(Transform.identity);

        /* We need to rotate either 179 or 181 degrees, depending on which direction we want
         * the rotation to be. If you rotate 180 degrees, Famo.us makes it undeterministic
         * which direction it tweens into. */
        this.stateModOne.setTransform(Transform.rotateY(radians(SquaresLoader.degrees-1)), SquaresLoader.transition);
        await new Promise((resolve) => { this.stateModTwo.setTransform(Transform.rotateY(radians(SquaresLoader.degrees+1)), SquaresLoader.transition, resolve); });
        await new Promise((resolve) => { Timer.setTimeout(resolve, SquaresLoader.delayInBetween); });
        
        this.stateModOne.setOrigin([0, 1]);
        this.stateModTwo.setOrigin([1, 0]);
        this.stateModOne.setTransform(Transform.identity);
        this.stateModTwo.setTransform(Transform.identity);

        this.stateModOne.setTransform(Transform.rotateX(radians(SquaresLoader.degrees+1)), SquaresLoader.transition);
        await new Promise((resolve) => { this.stateModTwo.setTransform(Transform.rotateX(radians(SquaresLoader.degrees-1)), SquaresLoader.transition, resolve); });
        await new Promise((resolve) => { Timer.setTimeout(resolve, SquaresLoader.delayInBetween); });
        
        Timer.after(this._animationLoop, 1);
    }
}