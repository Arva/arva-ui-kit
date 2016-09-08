/**
 * Created by vlad on 26/08/16.
 */

import Surface              from 'famous/core/Surface.js';
import Easing               from 'famous/transitions/Easing.js';
import {View}               from 'arva-js/core/View.js';
import {layout, flow}       from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {WhiteBox}           from './WhiteBox.js';
import {Clickable}          from './Clickable.js';
import {DoneIcon}           from '../icons/DoneIcon.js';
import {CrossIcon}          from '../icons/CrossIcon.js';
import {Colors}             from '../defaults/DefaultColors.js';

const innerBoxSize = Object.freeze([44, 44]);
const iconSize = [24, 24];
const iconZValue = 30;

// const curve = {curve: Easing.outCubic, duration: 200};

// @flow.viewStates({
//     'checked': [{innerBox: 'small', softShadowBox: 'small'}],
//     'unchecked': [{innerBox: 'big', softShadowBox: 'big'}]
// })
@layout.flow({spring: {dampingRatio: 0.8, period: 300}})
export class Checkbox extends Clickable {

    _inBounds = true;

    @layout.size(48, 48)
    @layout.stick.center()
    outerBox = new Surface({
        properties: {
            borderRadius: '4px',
            backgroundColor: 'rgb(170, 170, 170)'
        }
    });



    @layout.size(...innerBoxSize)
    @layout.stick.center()
    // @flow.stateStep('small', curve, layout.size(32, 32))
    // @flow.stateStep('big', curve, layout.size(...innerBoxSize))
    innerBox = new WhiteBox({
        enableSoftShadow: this.options.shadowType === 'softShadow'
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

    @layout.fullSize()
    @layout.translate(0, 0, 40)
    overlay = new Surface();

    constructor(options = {}) {
        super(combineOptions({
            shadowType: 'noShadow'
        }, options));
        if (this.options.shadowType === 'hardShadow'){
            this._enableHardShadow();
        }

        this.cross.setProperties({display: 'block'});
        this.tick.setProperties({display: 'none'});

        this._setupListeners();
    }

    _setupListeners() {
        this.overlay.on('touchstart', this._onTouchStart);
        this.overlay.on('mousedown', this._onTouchStart);
        this.overlay.on('touchend', this._onTouchEnd);
        this.overlay.on('mouseup', this._onTouchEnd);
        this.overlay.on('touchmove', this._onTouchMove);
        this.overlay.on('mouseout', this._onMouseMove);
    }

    _onTouchStart() {
        this._inBounds = true;
        this._scaleInnerBoxDown();
        // this.setViewFlowState('checked');
    }

    _onTouchEnd() {
        if (this._inBounds) {
            let isChecked = this._isChecked();

            this.tick.setProperties({display: isChecked ? 'none' : 'block'});
            this.cross.setProperties({display: isChecked ? 'block' : 'none'});
            this.outerBox.setProperties({backgroundColor: isChecked ? 'rgb(170, 170, 170)' : Colors.PrimaryUIColor});

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

    _isInBounds(touch) {
        let elemPosition = this.overlay._currentTarget.getBoundingClientRect();
        let [width, height] = this.overlay.getSize();

        var left = elemPosition.left,
            right = left + width,
            top = elemPosition.top,
            bottom = top + height,
            touchX = touch.touches[0].pageX,
            touchY = touch.touches[0].pageY;

        return (touchX > left && touchX < right && touchY > top && touchY < bottom);
    };
}