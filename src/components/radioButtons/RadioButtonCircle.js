/**
 * Created by vlad on 19/09/16.
 */

import {Surface}        from 'arva-js/surfaces/Surface.js';
import Easing               from 'famous/transitions/Easing.js';
import {layout, flow}       from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {Clickable}          from "../Clickable.js";
import {Colors}             from '../../defaults/DefaultColors.js';
import {getShadow}          from '../../defaults/DefaultShadows.js';

const inCurve = {transition: {curve: Easing.outCubic, duration: 200}};
const outCurve = {transition: {curve: Easing.outBack, duration: 200}};

@flow.viewStates({
    'selected': [{innerCircle: 'invisible'}],
    'deselected': [{innerCircle: 'visible'}]
})
export class RadioButtonCircle extends Clickable {

    @layout.fullSize()
    @layout.translate(0, 0, 0)
    backgroundCircle = new Surface({
        properties: {
            backgroundColor: this.options.activeColor,
            borderRadius: '50%',
            boxShadow: getShadow({
                color: this.options.activeColor,
                onlyForShadowType: 'hard',
                inset: true
            })
        }
    });

    @flow.stateStep('invisible', inCurve, layout.stick.center(), layout.translate(0, 0, 20), layout.scale(0, 0, 0))
    @flow.stateStep('visible', outCurve, layout.size(44, 44), layout.stick.center(), layout.translate(0, 0, 20), layout.scale(1, 1, 1))
    innerCircle = new Surface({
        properties: {
            borderRadius: '50%',
            backgroundColor: 'rgb(255, 255, 255)',
            boxShadow: getShadow({})
        }
    });

    constructor(options = {}) {
        super(combineOptions({
            activeColor: Colors.PrimaryUIColor
        }, options));

        if (this.options.selected) {
            this.select();
        } else {
            this.deselect();
        }

        if (this.options.icon) {
            this.addRenderable(new this.options.icon(), 'icon',
                layout.size(24, 24),
                layout.stick.center(),
                layout.translate(0, 0, 30)
            )
        }
    }

    select() {
        this.setViewFlowState('selected');
        if (this.icon) {
            this.icon.changeColor('rgb(255, 255, 255)');
        }
    }

    deselect() {
        this.setViewFlowState('deselected');
        if (this.icon) {
            this.icon.changeColor(this.options.activeColor);
        }
    }

}