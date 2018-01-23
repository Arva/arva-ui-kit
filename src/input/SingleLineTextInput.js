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

@bindings.setup({
    active: false,
    showBorder: true,
    showShadow: true,
    borderRadius: '4px',
    rounded: false,
    usesFeedback: true,
    required: false,
    value: '',
    expandFeedback: false,
    inputValidator: () => true,
    feedbackText: 'Required'
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
            this.options.inputValidator = (text) => !!text;
        }
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

    @layout.size(~40, ~40).dock.right().stick.topLeft().translate(-4, 4, 50)
    feedback = this.options.usesFeedback && FeedbackBubble.with({
        state:
            this.options.value ?
            this.options.inputValidator(this.options.value) ? 'correct' :
            (this.options.required ? 'required'  : 'incorrect') : 'required',
        rounded: this.options.rounded,
        expanded: this.inputOptions.expandFeedback,
        text: this.options.feedbackText,
        feedbackBubbleColor: this.options.incorrectColor
    });

    getSize() {
        return [undefined, Dimensions.ComponentHeight];
    }


/*
    @flow.stateStep('shown', flowOptions, ...showBubble)
    @flow.defaultState('hidden', closeTransition, ...hideBubble)
    correct = this.options.showCorrectBubble ? new FeedbackBubble({ variation: 'correct', rounded: this.options.rounded }) : null;

    @flow.stateStep('shown', flowOptions, ...showBubble)
    @flow.defaultState('hidden', closeTransition, ...hideBubble)
    incorrect = new FeedbackBubble({
        variation: 'incorrect',
        rounded: this.options.rounded,
        text: this.options.incorrectText,
        feedbackBubbleColor: this.options.incorrectColor
    });

    @flow.defaultState('hidden', flowOptions, ...hideBubble)
    @flow.stateStep('shown', closeTransition, ...showBubble)
    required = new FeedbackBubble({ variation: 'required', text: this.options.feedbackText, rounded: this.options.rounded });

    /!**
     * A text input field that can contain a single line of text, and optionally show required, correct, and incorrect FeedbackBubble icons.
     *
     * @example
     * @layout.dock.top(~48, 8)
     * input = new SingleLineTextInput({ placeholder: '' });
     *
     * @param {Object} [options] Construction options
     * @param {String} [options.content] Prefilled content of the input field
     * @param {String} [options.placeholder] Placeholder text of the input field
     * @param {Boolean} [options.usesFeedback] Option to enable specific layouting for displaying feedbackBubbles
     * @param {Boolean} [options.password] Hides entered characters, replacing them with system-defined asterisks or comparable
     * @param {Boolean} [options.required] If set to true, shows a FeedbackBubble stating the field is required to be filled in
     * @param {Boolean} [options.validator] Function that takes the string and returns {isValid: Boolean, feedback: String}
     * @param {Boolean} [options.feedbackText] The text that should display on feedback by default
     *!/
    constructor(options = {}) {
        super(combineOptions({
            required: false,
            enabled: true,
            usesFeedback: true,
            type: 'text',
            showBorder: true,
            showShadow: true,
            showCorrectBubble: true,
            inputOptions: { clearOnEnter: options.clearOnEnter },
            feedbackText: FeedbackBubble.texts.required,
            borderRadius: options.rounded ? "24px" : "4px"
        }, options));

        /!* The browser could auto-fill this stuff, so wait for deploy before checking if we have a value or not *!/
        if (this.options.required)

            setTimeout(() => {
                if (this.options.required) {
                    if (this.getValue()) {
                        this.setCorrectState(this.options.feedbackText);
                    } else {
                        this.setRequiredState();
                    }
                }
            }, 200);
    }

    setEnabled(enabled = true){
        return this.input.enable && this.input.enable(enabled);
    }

    enable() {
        this.setEnabled(true);
    }

    disable() {
        this.setEnabled(false);
    }

    setValue() {
        let result = this.input.setValue(...arguments);
        this._validateInput(this.getValue());
        return result;
    }

    getValue() {
        return this.input.getValue(...arguments);
    }

    focus() {
        return this.input.focus(...arguments);
    }

    setCorrectState(message = '') {
        if (message) {
            this.correct.setText(message);
        }

        this._eventOutput.emit('stateCorrect');
    }


    setIncorrectState(message = '') {
        if (message) {
            this.incorrect.setText(message);
        }
        this._eventOutput.emit('stateIncorrect');
    }

    isStateCorrect() {
        return this.getViewFlowState() === 'correct' || !this.options.usesFeedback;
    }

    setRequiredState() {
        /!* This is incorrect state, because there's nothing in the field as of now *!/
        this._eventOutput.emit('stateIncorrect');
    }

    getSize() {
        return [undefined, 48];
    }


    revalidate() {
        this._validateInput(this.getValue());
    }

    _onFocus() {
        if (this.correct) { this.correct.collapse() };
        this.incorrect.collapse();
        this.required.collapse();
    }

    _onBlur() {
    }

    /!**
     *
     * @param inputString
     * @private
     *!/
    _validateInput(inputString) {

        if (this.options.validator) {
            if (this.options.required && !inputString) {
                this.setRequiredState();
            } else {
                let { isValid, feedback } = this.options.usesFeedback? this.options.validator(inputString):true;
                if (isValid) {
                    this.setCorrectState(feedback);
                } else {
                    this.setIncorrectState(feedback);
                }
            }

        } else if (this.options.required) {
            if (inputString) {
                this.setCorrectState(this.options.feedbackText);
            } else {
                this.setRequiredState();
            }
        } else {
            this._eventOutput.emit('stateCorrect'); // we only emit the correct state on change -- there is no feedback elements
        }
    }*/
}