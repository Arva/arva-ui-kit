/**
 * Created by vlad on 26/08/16.
 */

import Easing from 'famous/transitions/Easing.js';
import Timer from 'famous/utilities/Timer.js';
import {Surface} from 'arva-js/surfaces/Surface.js';

import {
    layout, flow, bindings,
    dynamic
} from 'arva-js/layout/Decorators.js';
import {combineOptions} from 'arva-js/utils/CombineOptions.js';

import {CheckIcon} from './icons/CheckIcon.js';
import {CrossIcon} from './icons/CrossIcon.js';
import {Colors} from '../defaults/DefaultColors.js';
import {getShadow} from '../defaults/DefaultShadows.js';
import {Clickable} from './Clickable.js';


const iconSize = [16, 16];
const iconZValue = 30;
const inCurve = {curve: Easing.outCubic, duration: 200};
const outCurve = {curve: Easing.outBack, duration: 200};
const compressIfPressed = (isPressed) => isPressed ?
    flow.transition(inCurve)(layout.scale(0.73, 0.73, 0.73)) :
    flow.transition(outCurve)(layout.scale(1, 1, 1));

@dynamic(() =>
    bindings.setup({
        activeColor: Colors.PrimaryUIColor,
        inactiveColor: 'rgb(170, 170, 170)',
        state: true,
        enabled: true,
        isPressed: false
    })
)
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

    @layout.size(44, 44)
        .stick.center()
        .translate(0, 0, 10)
    @dynamic(({isPressed}) => compressIfPressed(isPressed))
    innerBox = Surface.with({
        properties: {
            borderRadius: '2px',
            backgroundColor: 'white',
            boxShadow: getShadow({})
        }
    });

    @layout
        .fullSize()
        .translate(0, 0, 40)
    overlay = Surface.with({properties: {cursor: 'pointer'}});

    @layout.stick.center().size(...iconSize).translate(0, 0, iconZValue)
    @dynamic(({state}) =>
        layout.opacity(state ? 1 : 0)
    )
    @dynamic(({isPressed}) =>
        compressIfPressed(isPressed)
    )
    tick = CheckIcon.with({color: this.options.activeColor});

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
    setCheckState() {
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
