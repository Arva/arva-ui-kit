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

import {Colors}                         from '../defaults/DefaultColors.js';

/* Needs to be a ContainerSurface because we need to set a "perspective" property relative to a parent element. */
export class SquaresLoader extends ContainerSurface {
    static degrees = 180;
    static delayInBetween = 200;
    static transition = {duration: 400, curve: Easing.outCubic};
    
    active = false;

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
     * new DataBoundScrollView({ placeholderTemplate: () => new SquaresLoader({ size: [48, 48] }) });
     */
    constructor() {
        super();
        this.context.setPerspective(100);

        let surfaceProperties = {
            properties: {backgroundColor: Colors.PrimaryUIColor, perspective: '500px', backfaceVisibility: 'visible'}
        };
        this.squareOne = new Surface(surfaceProperties);
        this.squareTwo = new Surface(surfaceProperties);

        this.stateModOne = new StateModifier({proportions: [0.5, 0.5], origin: [1, 1], align: [0.5, 0.5]});
        this.stateModTwo = new StateModifier({proportions: [0.5, 0.5], origin: [0, 0], align: [0.5, 0.5]});

        this.add(this.stateModOne).add(this.squareOne);
        this.add(this.stateModTwo).add(this.squareTwo);
        
        this._animationLoop = this._animationLoop.bind(this);

        /* Cancel animations when the renderable is removed from the render tree. */
        this.on('deploy', () => { this.active = true; this._animationLoop(); });
        this.on('recall', () => { this.active = false; });
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