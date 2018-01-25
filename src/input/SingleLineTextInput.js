/**
 * Created by tom on 12/09/16.
 */

import {Surface}                from 'arva-js/surfaces/Surface.js';
import Easing                   from 'famous/transitions/Easing.js';

import {View}                   from 'arva-js/core/View.js';
import {layout, flow, event,
bindings, dynamic}              from 'arva-js/layout/Decorators.js';
import {flowStates}             from 'arva-js/layout/FlowStates.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {SingleLineInputSurface} from './SingleLineInputSurface.js';
import {FeedbackBubble}         from './textInput/FeedbackBubble.js';
import {Dimensions}             from '../defaults/DefaultDimensions.js';
import {TypeFaces}              from '../defaults/DefaultTypefaces.js';

const transition = { curve: Easing.outCubic, duration: 200 };
const closeTransition = { curve: Easing.outCubic, duration: 200 };
const flowOptions = { curve: Easing.outCubic, duration: 300 };
const showBubble = layout.size(~40, 40).dock.right().stick.topLeft().translate(-4, 4, 50);
const hideBubble = [layout.dock.none(), layout.dockSpace(8), layout.stick.right(), layout.size(~40, 40), layout.translate(0, 0, -20)];

/**
 *
 * A text input field that can contain a single line of text, and optionally show required, correct, and incorrect FeedbackBubble icons.
 *
 *
 * @example
 * SingleLineTextInput.with({
 *      placeholder: 'input',
 *      value: this.inputOptions.sentence,
 *      enabled: this.options.shouldEnable,
 *      feedbackText: 'numerical',
 *      inputValidator: (text) => /^\d*$/,
 *      required: true
 *  })
 */
@bindings.setup({
    active: false,
    showBorder: true,
    showShadow: true,
    borderRadius: '4px',
    rounded: false,
    usesFeedback: true,
    required: true,
    showFeedback: false,
    value: '',
    expandFeedback: false,
    inputValidator: () => true,
    correctText: 'Correct',
    incorrectText: 'Incorrect',
    requiredText: 'Required',
})
export class SingleLineTextInput extends View {

    @bindings.trigger()
    roundIfNeeded() {
        if(this.options.rounded){
            this.options.borderRadius = '24px';
        }
    }

    @bindings.trigger()
    feedbackIfRequired() {
        if(this.options.required){
            this.options.usesFeedback = true;
        }
    }

    @bindings.trigger()
    hideFeedback({required, value}) {
        this.options.showFeedback = required || value;
        this._lastState = this.options.state;
    }

    @layout.stick.center().opacity(1).translate(-1, 0, 10).fullSize()
    @dynamic(({active}) => flow.transition(transition)(layout.opacity(active ? 0 : 1)))
    border = this.options.showBorder ? Surface.with({
            properties: {
                border: 'solid 1px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'rgb(255, 255, 255)',
                borderRadius: this.options.borderRadius,
                ...this.options.borderProperties
            }
        }
    ) : null;

    @layout.stick.center().translate(0, 0, 20)
    @dynamic(({active}) => flow.transition(transition)(layout.opacity(active ? 1 : 0)))
    shadow = this.options.showShadow ? Surface.with({
            properties: {
                boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.12)',
                backgroundColor: 'rgb(255, 255, 255)',
                borderRadius: this.options.borderRadius,
                ...this.options.shadowProperties
            }
        }
    ) : null;

    @layout.dock.fill().translate(0, 0, 30)
    @event.on('focus', function () { this.options.active = true;  })
        .on('blur', function () {
            this.options.active = false;
        })
    input =  SingleLineInputSurface.with({
        value: this.inputOptions.value,
        enabled: this.options.enabled === undefined ? true : this.options.enabled,
        type: this.options.password ? 'password' : this.options.type,
        clearOnEnter: this.options.clearOnEnter,
        placeholder: this.options.placeholder,
        properties: {
            backgroundColor: 'transparent',
            padding: this.options.usesFeedback ? '16px 48px 16px 16px' : '0px 16px 0px 16px',
            borderRadius: this.options.borderRadius,
            boxShadow: 'none',
            ...TypeFaces.UIRegular,
            lineHeight: 'normal', /* Don't reorder this to above UIRegular, or it will overwrite */
            ...this.options.backgroundProperties
        },
        ...this.options.inputOptions
    });

    @dynamic(({showFeedback, required}) =>
         !required && (showFeedback ?
        flow.transition({duration: 150, curve: Easing.outBack})(layout.scale(1, 1 ,1)) :
        flow.transition({duration: 150, curve: Easing.inCubic})(layout.scale(0, 0, 0))
        )
    )
    @layout.dock.right(40).size(40, 40).stick.center().translate(-6, 0, 50)
    feedback = this.options.usesFeedback && FeedbackBubble.with({
        state: this._isStateCorrect(),
        rounded: this.options.rounded,
        expanded: this.inputOptions.expandFeedback,
        feedbackBubbleColor: this.options.incorrectColor,
        correctText: this.options.correctText,
        incorrectText: this.options.incorrectText,
        requiredText: this.options.requiredText,
    });

    _isStateCorrect() {
        return this.options.showFeedback ?
        this.options.value ?
            (this.options.inputValidator(this.options.value) ? 'correct' : 'incorrect') : 'required':
            this._lastState;
    }

    getSize() {
        return [undefined, Dimensions.ComponentHeight];
    }
}