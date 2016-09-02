/**
 * Created by vlad on 26/08/16.
 */

import Surface              from 'famous/core/Surface.js';
import Easing               from 'famous/transitions/Easing.js';
import {layout, flow}       from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {WhiteBox}           from './WhiteBox.js';
import {Button}             from '../buttons/Button.js';
import {DoneIcon}           from '../icons/DoneIcon.js';
import {CrossIcon}          from '../icons/CrossIcon.js';
import {Colors}             from '../defaults/DefaultColors.js';

const innerBoxSize = [44, 44];
const iconSize = [24, 24];
const iconZValue = 30;
// const curve = {curve: Easing.outCubic, duration: 200};

// @flow.viewStates({
//     'checked': [{innerBox: 'small', softShadowBox: 'small'}],
//     'unchecked': [{innerBox: 'big', softShadowBox: 'big'}]
// })
@layout.flow({})
export class Checkbox extends Button {

    @layout.size(...innerBoxSize)
    @layout.stick.center()
    // @flow.stateStep('small', curve, layout.size(32, 32))
    // @flow.stateStep('big', curve, layout.size(...innerBoxSize))
    innerBox = new WhiteBox({
        enableSoftShadow: this.options.shadowType === 'softShadow',
        makeRipple: false
    });

    @layout.size(...iconSize)
    @layout.stick.center()
    @layout.translate(0, 0, iconZValue)
        // @flow.stateStep('disabled', curve, layout.opacity(0))
        // @flow.stateStep('enabled', curve, layout.opacity(1))
    tick = new DoneIcon({color: Colors.PrimaryUIColor});

    @layout.size(...iconSize)
    @layout.stick.center()
    @layout.translate(0, 0, iconZValue)
    cross = new CrossIcon({color: 'rgb(170, 170, 170)'});

    constructor(options = {}) {
        super(combineOptions({
            shadowType: 'noShadow',
            makeRipple: false,
            useBoxShadow: false,
            backgroundProperties: {
                cursor: 'pointer',
                borderRadius: '4px',
                backgroundColor: 'rgb(170, 170, 170)'
            }
        }, options));

        if (this.options.shadowType === 'hardShadow'){
            this._enableHardShadow();
        }

        // Initialize to unchecked
        this.cross.setProperties({display: 'block'});
        this.tick.setProperties({display: 'none'});

        // this._setupListeners();
    }

    _setupListeners() {
        this.on('touchstart', this._onTapStart);
        this.on('mousedown', this._onTapStart);
        this.on('touchend', this._onTapEnd);
        this.on('mouseup', this._onTapEnd);
        this.on('touchmove', this._onTouchMove);
        this.on('mouseout', this._onMouseMove);
    }

    _handleTapStart(mouseEvent) {
        this._inBounds = true;
        this._scaleInnerBoxDown();
        // this.setViewFlowState('checked');
    }

    _handleTapEnd() {
        if (this._inBounds) {
            let isChecked = this._isChecked();

            this.tick.setProperties({display: isChecked ? 'none' : 'block'});
            this.cross.setProperties({display: isChecked ? 'block' : 'none'});
            this.background.setProperties({backgroundColor: isChecked ? 'rgb(170, 170, 170)' : Colors.PrimaryUIColor});

            // this.setViewFlowState('unchecked');

            this._scaleInnerBoxUp();
        }
    }

    _onMouseMove() {
        this._scaleInnerBoxUp();
        // this.setViewFlowState('unchecked');
    }

    _handleTouchMove(touchEvent){
        this._inBounds = this._isInBounds(touchEvent);
        if(!this._inBounds){
            this._scaleInnerBoxUp();
        }
    }

    _scaleInnerBoxDown() {
        this.decorateRenderable('innerBox', layout.size(32, 32));
    }

    _scaleInnerBoxUp() {
        this.decorateRenderable('innerBox', layout.size(...innerBoxSize));
    }

    _isChecked() {
        return this.tick.getProperties().display === 'block' && this.cross.getProperties().display === 'none';
    }

    _enableHardShadow() {
        this.outerBox.setProperties({boxShadow: 'inset 0px 2px 0px 0px rgba(0,0,0,0.12)'});
        this.innerBox.setProperties({boxShadow: '0px 2px 0px 0px rgba(0,0,0,0.12)'});
    }
}