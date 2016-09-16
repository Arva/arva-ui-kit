/**
 * Created by vlad on 26/08/16.
 */

import Easing               from 'famous/transitions/Easing.js';
import {layout, flow}       from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {View}                   from 'arva-js/core/View.js';

import {DoneIcon}           from '../icons/DoneIcon.js';
import {CrossIcon}          from '../icons/CrossIcon.js';
import {Colors}             from '../defaults/DefaultColors.js';
import {getShadow}          from '../defaults/DefaultShadows.js';
import {Clickable}          from './Clickable.js';

import Timer                from 'famous/utilities/Timer.js';
import Surface              from 'famous/core/Surface.js';

const iconSize = [24, 24];
const iconZValue = 30;
const inCurve = {transition: {curve: Easing.outCubic, duration: 200}};
const outCurve = {transition: {curve: Easing.outBack, duration: 200}};
const defaultIconOptions = [layout.stick.center(), layout.size(...iconSize), layout.translate(0, 0, iconZValue)];

@flow.viewStates({
    'checked': [{innerBox: 'big', tick: 'enabled', cross: 'disabled'}],
    'pressed': [{innerBox: 'small', tick: 'pressed', cross: 'pressed'}],
    'unchecked': [{innerBox: 'big', tick: 'disabled', cross: 'enabled'}]
})

export class Checkbox extends Clickable {

    @layout.fullSize()
    @layout.translate(0, 0, -10)
    background = new Surface({
        properties: {
            backgroundColor: this.options.enabled ? this.options.activeColor : this.options.inactiveColor,
            borderRadius: '4px',
            boxShadow: getShadow({
                inset: true,
                onlyForShadowType: 'hard',
                color: this.options.activeColor
            })
        }
    });

    @flow.stateStep('small', inCurve, layout.stick.center(), layout.translate(0, 0, 10), layout.scale(.75, .75, .75))
    @flow.stateStep('big', outCurve, layout.size(44, 44), layout.scale(1, 1, 1), layout.stick.center(), layout.translate(0, 0, 10))
    innerBox = new Surface({
        properties: {
            borderRadius: '2px',
            backgroundColor: 'white',
            boxShadow: getShadow({})
        }
    });

    @layout.fullSize()
    @layout.translate(0, 0, 40)
    overlay = new Surface({properties: {cursor: 'pointer'}});


    @flow.stateStep('disabled', outCurve, layout.opacity(0), ...defaultIconOptions, layout.scale(1, 1, 1))
    @flow.stateStep('pressed', inCurve, layout.scale(0.73, 0.73, 0.73))
    @flow.stateStep('enabled', outCurve, layout.opacity(1), ...defaultIconOptions, layout.scale(1, 1, 1))
    tick = new DoneIcon({color: this.options.activeColor});

    @flow.stateStep('disabled', outCurve, layout.opacity(0), ...defaultIconOptions)
    @flow.stateStep('pressed', inCurve, layout.size(iconSize[0] * 0.73, iconSize[1] * 0.73))
    @flow.stateStep('enabled', outCurve, layout.opacity(1), ...defaultIconOptions)
    cross = new CrossIcon({color: this.options.inactiveColor});

    /**
     * Checkbox that be used to enable and disable options
     *
     * @example
     * checkbox = new Checkbox({
     *     shadowType: 'softShadow',
     *     enabled: true
     * });
     *
     * @param {Object} options Construction options
     * @param {Boolean} [options.enabled] Enable checkbox
     * @param {String} [options.shadowType] The type of shadow to use ('noShadow' [default], 'softShadow', 'hardShadow')
     */
    constructor(options = {}) {
        super(combineOptions({
            activeColor: Colors.PrimaryUIColor,
            inactiveColor: 'rgb(170, 170, 170)'
        }, options));

        if (this.options.shadowType === 'hardShadow') {
            this._enableHardShadow();
        }

        this.setViewFlowState(this.options.enabled ? 'checked' : 'unchecked');
        this.on('mouseout', this._onMouseOut);
    }

    _handleTapStart(mouseEvent) {
        this._inBounds = true;
        this.setViewFlowState('pressed');
    }

    check() {
        if (!this.isChecked()) {
            this._handleTapStart();

            /* Timout to handle the checked animation */
            Timer.setTimeout(() => {
                this._handleTapEnd();
            }, 50);
        }
    }

    unCheck() {
        if (this.isChecked()) {
            this._handleTapStart();

            /* Timout to handle the checked animation */
            Timer.setTimeout(() => {
                this._handleTapEnd();
            }, 50);
        }
    }

    isChecked() {
        return this.background.getProperties().backgroundColor === this.options.activeColor;
    }

    getSize() {
        return [48, 48]
    }

    _handleTapEnd() {
        if (this._inBounds) {
            let isChecked = this.isChecked();

            this.tick.setProperties({display: isChecked ? 'none' : 'block'});
            this.cross.setProperties({display: isChecked ? 'block' : 'none'});
            this.background.setProperties({backgroundColor: isChecked ? this.options.inactiveColor : this.options.activeColor});

            this.setViewFlowState(isChecked ? 'unchecked' : 'checked');
        }
    }

    _onMouseOut() {
        this.setViewFlowState(this.isChecked() ? 'checked' : 'unchecked');
    }

    _handleTouchMove(touchEvent) {
        this._inBounds = this._isInBounds(touchEvent, this.background);
        if (!this._inBounds) {
            this.setViewFlowState(this.isChecked() ? 'checked' : 'unchecked');
        }
    }
}
