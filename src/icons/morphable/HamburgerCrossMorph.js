/**
 * Created by lundfall on 14/07/2017.
 */


/**
 * Created by lundfall on 13/07/2017.
 */
import {View}                           from 'arva-js/core/View.js'
import {layout, flow, event}            from 'arva-js/layout/Decorators.js'
import {Surface}                        from 'arva-js/surfaces/Surface.js';
import {InputSurface}                   from 'arva-js/surfaces/InputSurface.js';

import {combineOptions}                 from 'arva-js/utils/combineOptions.js';

let animationOpts = { transition: { duration: 200 } };


@flow.viewStates({
    hamburger: [{
        bottomStick: 'straight',
        centerStick: 'shown',
        topStick: 'straight'
    }],
    cross: [{
        bottomStick: 'tilted',
        centerStick: 'hidden',
        topStick: 'tilted'
    }]
})
/**
 * A burger that can be turned into a cross
 */
export class HamburgerCrossMorph extends View {


    @flow.stateStep('tilted', animationOpts,
        layout.translate(0, 0, 0))
    @flow.stateStep('tilted', animationOpts, layout.rotate(0, 0, Math.PI / 4)
    )
    @flow.defaultState('straight', animationOpts,
        layout.translate(0, -8, 0),
        layout.stick.center(),
        layout.size(0.6, 3),
        layout.rotate(0, 0, 0))
    topStick = new Shape({backgroundColor: this.options.backgroundColor});

    @flow.stateStep('hidden', animationOpts, layout
        .opacity(0))
    @flow.defaultState('shown', animationOpts,
        layout.stick.center(),
        layout.translate(0, 0, 0),
        layout.size(0.6, 3),
        layout.opacity(1))
    centerStick = new Shape({backgroundColor: this.options.backgroundColor});


    @flow.stateStep('tilted', animationOpts, layout
        .translate(0, 0, 0))
    @flow.stateStep('tilted', animationOpts, layout
        .rotate(0, 0, -Math.PI / 4)
    )
    @flow.defaultState('straight', animationOpts,
        layout.translate(0, 8, 0),
        layout.stick.center(),
        layout.rotate(0, 0, 0),
        layout.size(0.6, 3))
    bottomStick = new Shape({backgroundColor: this.options.backgroundColor});


    turnIntoHamburger() {
        this.setViewFlowState('hamburger');
    }

    turnIntoCross() {
        this.setViewFlowState('cross');
    }

}


class Shape extends Surface {
    constructor(options = {}) {
        let {backgroundColor = 'white'} = options;
        super({
            properties: {
                backgroundColor,
                borderRadius: '2px'
            }
        })
    }
}