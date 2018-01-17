/**
 * Created by vlad on 26/08/16.
 */

<<<<<<< HEAD
import Easing                      from 'famous/transitions/Easing.js';
import Timer                       from 'famous/utilities/Timer.js';
import {Surface}        from 'arva-js/surfaces/Surface.js';

import {layout, flow, bindings}    from 'arva-js/layout/Decorators.js';
import {combineOptions}            from 'arva-js/utils/CombineOptions.js';

import {DoneIcon}                  from '../icons/DoneIcon.js';
import {CrossIcon}                 from '../icons/CrossIcon.js';
import {Colors}                    from '../defaults/DefaultColors.js';
import {getShadow}                 from '../defaults/DefaultShadows.js';
import {Clickable}                 from './Clickable.js';
=======
import Easing from 'famous/transitions/Easing.js';
import Timer from 'famous/utilities/Timer.js';
import {Surface} from 'arva-js/surfaces/Surface.js';

import {
    layout, flow, bindings,
    dynamic
} from 'arva-js/layout/Decorators.js';
import {combineOptions} from 'arva-js/utils/CombineOptions.js';

import {DoneIcon} from '../icons/DoneIcon.js';
import {CrossIcon} from '../icons/CrossIcon.js';
import {Colors} from '../defaults/DefaultColors.js';
import {getShadow} from '../defaults/DefaultShadows.js';
import {Clickable} from './Clickable.js';
>>>>>>> studio


const iconSize = [24, 24];
const iconZValue = 30;
<<<<<<< HEAD
const inCurve = {transition: {curve: Easing.outCubic, duration: 200}};
const outCurve = {transition: {curve: Easing.outBack, duration: 200}};
const defaultIconOptions = [layout.stick.center(), layout.size(...iconSize), layout.translate(0, 0, iconZValue)];

@flow.viewStates({
    'checked': [{innerBox: 'big', tick: 'enabled', cross: 'disabled'}],
    'pressed': [{innerBox: 'small', tick: 'pressed', cross: 'pressed'}],
    'unchecked': [{innerBox: 'big', tick: 'disabled', cross: 'enabled'}]
})

@bindings.setup({
    state: false
})
export class Checkbox extends Clickable {

=======
const inCurve = {curve: Easing.outCubic, duration: 200};
const outCurve = {curve: Easing.outBack, duration: 200};
const compressIfPressed = (isPressed) => isPressed ?
    flow.transition(inCurve)(layout.scale(0.73, 0.73, 0.73)) :
    flow.transition(outCurve)(layout.scale(1, 1, 1));

@bindings.setup({
    activeColor: Colors.PrimaryUIColor,
    inactiveColor: 'rgb(170, 170, 170)',
    state: true,
    enabled: true,
    isPressed: false
})
/**
 * Checkbox that be used to enable and disable options
 *
 * @example
 * checkbox = new Checkbox({
     *     shadowType: 'softShadow',
     *     state: true
     * });
 *
 * @param {Object} options Construction options
 * @param {Boolean} [options.enabled] Set the state of the checkbox
 * @param {String} [options.shadowType] The type of shadow to use ('noShadow' [default], 'softShadow', 'hardShadow')
 */
export class Checkbox extends Clickable {


>>>>>>> studio
    @layout
        .fullSize()
        .translate(0, 0, -10)
    background = Surface.with({
        properties: {
            backgroundColor: this.options.state ? this.options.activeColor : this.options.inactiveColor,
            borderRadius: '4px',
            boxShadow: getShadow({
                inset: true,
                onlyForShadowType: 'hard',
                color: this.options.activeColor
            })
        }
    });

<<<<<<< HEAD
    @flow
        .stateStep('small', inCurve, layout.stick.center(), layout.translate(0, 0, 10), layout.scale(.75, .75, .75))
        .stateStep('big', outCurve, layout.size(44, 44), layout.scale(1, 1, 1), layout.stick.center(), layout.translate(0, 0, 10))
    innerBox = new Surface({
=======
    @layout.size(44, 44)
        .stick.center()
        .translate(0, 0, 10)
    @dynamic(({isPressed}) => compressIfPressed(isPressed))
    innerBox = Surface.with({
>>>>>>> studio
        properties: {
            borderRadius: '2px',
            backgroundColor: 'white',
            boxShadow: getShadow({})
        }
    });

    @layout
        .fullSize()
        .translate(0, 0, 40)
<<<<<<< HEAD
    overlay = new Surface({properties: {cursor: 'pointer'}});


    @flow
        .stateStep('disabled', outCurve, layout.opacity(0), ...defaultIconOptions, layout.scale(1, 1, 1))
        .stateStep('pressed', inCurve, layout.scale(0.73, 0.73, 0.73))
        .stateStep('enabled', outCurve, layout.opacity(1), ...defaultIconOptions, layout.scale(1, 1, 1))
    tick = DoneIcon.with({color: this.options.activeColor});

    @flow.stateStep('disabled', outCurve, layout.opacity(0), ...defaultIconOptions)
        .stateStep('pressed', inCurve, layout.size(iconSize[0] * 0.73, iconSize[1] * 0.73))
        .stateStep('enabled', outCurve, layout.opacity(1), ...defaultIconOptions)
    cross = CrossIcon.with({color: this.options.inactiveColor});


    /**
     * Checkbox that be used to enable and disable options
     *
     * @example
     * checkbox = new Checkbox({
     *     shadowType: 'softShadow',
     *     state: true
     * });
     *
     * @param {Object} options Construction options
     * @param {Boolean} [options.enabled] Set the state of the checkbox
     * @param {String} [options.shadowType] The type of shadow to use ('noShadow' [default], 'softShadow', 'hardShadow')
     */
    constructor(options = {}) {
        super(combineOptions({
            activeColor: Colors.PrimaryUIColor,
            inactiveColor: 'rgb(170, 170, 170)',
            state: true,
            enabled: true
        }, options));

        this.state = this.options.state;

        this.setViewFlowState(this.options.state ? 'checked' : 'unchecked');
        this.on('mouseout', this._onMouseOut.bind(this));
    }

    _handleTapStart(mouseEvent) {
        this._inBounds = true;
        this.setViewFlowState('pressed');
    }

    _handleTapEnd() {
        if (this._inBounds) {
            let isChecked = this.isChecked();

            this.tick.setProperties({display: isChecked ? 'none' : 'block'});
            this.cross.setProperties({display: isChecked ? 'block' : 'none'});

            this.setViewFlowState(isChecked ? 'unchecked' : 'checked');
            this.options.state = !isChecked;

            this._eventOutput.emit(isChecked ? 'unchecked' : 'checked');
            this._eventOutput.emit('change', isChecked);
        }
    }

    _handleTouchMove(touchEvent) {
        this._inBounds = this._isInBounds(touchEvent, this.background);
        if (!this._inBounds) {
            this.setViewFlowState(this.isChecked() ? 'checked' : 'unchecked');
        }
    }

    _onMouseOut() {
        this.setViewFlowState(this.isChecked() ? 'checked' : 'unchecked');
=======
    overlay = Surface.with({properties: {cursor: 'pointer'}});

    @layout.stick.center().size(...iconSize).translate(0, 0, iconZValue)
    @dynamic(({state}) =>
        layout.opacity(state ? 1 : 0)
    )
    @dynamic(({isPressed}) =>
        compressIfPressed(isPressed)
    )
    tick = DoneIcon.with({color: this.options.activeColor});

    @layout.stick.center().size(...iconSize).translate(0, 0, iconZValue)
    @dynamic(({state}) =>
        layout.opacity(state ? 0 : 1)
    )
    @dynamic(({isPressed}) =>
        compressIfPressed(isPressed)
    )
    cross = CrossIcon.with({color: this.options.inactiveColor});


    _handleTapStart() {
        this._inBounds = true;
        this.options.isPressed = true;
    }

    _handleTapEnd() {
        let isChecked = this.isChecked();
        this.options.isPressed = false;
        this.options.state = !isChecked;
        this._eventOutput.emit(isChecked ? 'unchecked' : 'checked');
        this._eventOutput.emit('change', isChecked);
    }

    _handleTapRemoved() {
        this._handleTapEnd();
>>>>>>> studio
    }

    /**
     * Mark the checkbox as checked.
     */
    check() {
        !this.isChecked() && this.setCheckState();
    }

    /**
     * Mark the checkbox as unchecked.
     */
    unCheck() {
        this.isChecked() && this.setCheckState();
    }

    /**
     * this.state will be handled by handleTapEnd, as tapEnds can be triggered by MouseEvents too
     */
<<<<<<< HEAD
    setCheckState(){
=======
    setCheckState() {
>>>>>>> studio
        this._handleTapStart();

        /* Timout to handle the checked animation */
        Timer.setTimeout(() => {
            this._handleTapEnd();
        }, 50);
    }

    /**
     * Returns true if the checkbox is marked as checked.
     * @returns {boolean}
     */
    isChecked() {
        return this.options.state;
    }

    getSize() {
        return [48, 48]
    }
}
