/**
 * Created by vlad on 26/08/16.
 */

import Easing               from 'famous/transitions/Easing.js';
import {layout, flow}       from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {WhiteBox}           from './WhiteBox.js';
import {Button}             from '../buttons/Button.js';
import {DoneIcon}           from '../icons/DoneIcon.js';
import {CrossIcon}          from '../icons/CrossIcon.js';
import {Colors}             from '../defaults/DefaultColors.js';
import Timer                from 'famous/utilities/Timer.js';

const innerBoxSize = [44, 44];
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
export class Checkbox extends Button {

    @flow.stateStep('small', inCurve, layout.stick.center(), layout.translate(0, 0, 10), layout.scale(.75, .75, .75))
    @flow.stateStep('big', outCurve, layout.size(44, 44), layout.scale(1, 1, 1), layout.stick.center(), layout.translate(0, 0, 10))
    innerBox = new WhiteBox({
        enableSoftShadow: this.options.shadowType === 'softShadow',
        makeRipple: false
    });

    @flow.stateStep('disabled', outCurve, layout.opacity(0), ...defaultIconOptions, layout.scale(1, 1, 1))
    @flow.stateStep('pressed', inCurve, layout.scale(0.73, 0.73, 0.73))
    @flow.stateStep('enabled', outCurve, layout.opacity(1), ...defaultIconOptions, layout.scale(1, 1, 1))
    tick = new DoneIcon({color: Colors.PrimaryUIColor});

    @flow.stateStep('disabled', outCurve, layout.opacity(0), ...defaultIconOptions)
    @flow.stateStep('pressed', inCurve, layout.size(iconSize[0] * 0.73, iconSize[1] * 0.73))
    @flow.stateStep('enabled', outCurve, layout.opacity(1), ...defaultIconOptions)
    cross = new CrossIcon({color: 'rgb(170, 170, 170)'});

    constructor(options = {}) {
        super(combineOptions({
            enabled: true,
            shadowType: 'noShadow',
            makeRipple: false,
            useBoxShadow: false,
            backgroundProperties: {
                cursor: 'pointer',
                borderRadius: '4px',
                backgroundColor: 'rgb(170, 170, 170)'
            }
        }, options));

        if (this.options.shadowType === 'hardShadow') {
            this._enableHardShadow();
        }

        this.background.setProperties({backgroundColor: this.options.enabled ? Colors.PrimaryUIColor : 'rgb(170, 170, 170)'});

        this.setViewFlowState(this.options.enabled ? 'checked' : 'unchecked');
    }

    _setupListeners() {
        this.on('touchstart', this._onTapStart);
        this.on('mousedown', this._onTapStart);
        this.on('touchend', this._onTapEnd);
        this.on('mouseup', this._onTapEnd);
        this.on('touchmove', this._onTouchMove);
        this.on('mouseout', this._onMouseOut);
    }

    _handleTapStart(mouseEvent) {
        this._inBounds = true;
        this.setViewFlowState('pressed');
    }

    check() {
        if(!this.isChecked()){
            this._handleTapStart();
            Timer.setTimeout(() => {
                this._handleTapEnd();
            },50);
        }
    }

    unCheck() {
        if(this.isChecked()){
            this._handleTapStart();
            Timer.setTimeout(() => {
                this._handleTapEnd();
            },50);
        }
    }

    _handleTapEnd() {
        if (this._inBounds) {
            let isChecked = this.isChecked();

            this.tick.setProperties({display: isChecked ? 'none' : 'block'});
            this.cross.setProperties({display: isChecked ? 'block' : 'none'});
            this.background.setProperties({backgroundColor: isChecked ? 'rgb(170, 170, 170)' : Colors.PrimaryUIColor});

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

    isChecked() {
        return this.background.getProperties().backgroundColor === Colors.PrimaryUIColor;
    }

    _enableHardShadow() {
        this.outerBox.setProperties({boxShadow: 'inset 0px 2px 0px 0px rgba(0,0,0,0.12)'});
        this.innerBox.setProperties({boxShadow: '0px 2px 0px 0px rgba(0,0,0,0.12)'});
    }
}