/**
 * Created by tom on 12/09/16.
 */

import Surface                  from 'famous/core/Surface.js';
import Easing                   from 'famous/transitions/Easing.js';

import {View}                   from 'arva-js/core/View.js';
import {layout, flow, event}    from 'arva-js/layout/Decorators.js';
import {flowStates}             from 'arva-js/layout/FlowStates.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {SingleLineInputSurface} from './SingleLineInputSurface.js';
import {FeedbackBubble}         from './textInput/FeedbackBubble.js';
import {Dimensions}             from '../defaults/DefaultDimensions.js';
import {TypeFaces}              from '../defaults/DefaultTypefaces.js';

let {searchBar: {borderRadius}} = Dimensions;
const transition = {transition: {curve: Easing.outCubic, duration: 200}, delay: 0};
const closeTransition = {transition: {curve: Easing.outCubic, duration: 200}, delay: 0};
const flowOptions = {transition: {curve: Easing.outCubic, duration: 300}, delay: 0};
const showBubble = [layout.size(~40, 40), layout.dock.right(), layout.stick.topLeft(), layout.translate(0, 4, 50)];
const hideBubble = [layout.dock.none(), layout.dockSpace(8), layout.stick.right(), layout.size(~40, 40), layout.translate(0, 0, -20)];

@flow.viewStates({
    correct: [{correct: 'shown', incorrect: 'hidden', required: 'hidden'}],
    required: [{correct: 'hidden', incorrect: 'hidden', required: 'shown'}],
    incorrect: [{correct: 'hidden', incorrect: 'shown', required: 'hidden'}]
})
@layout.dockPadding(0, 4, 0, 0)
export class SingleLineTextInput extends View {

    @flow.stateStep('hidden', transition, layout.opacity(0))
    @flow.defaultState('shown', transition, layout.stick.center(), layout.opacity(1), layout.translate(-1, -1, 10))
    border = new Surface({
            properties: {
                border: 'solid 1px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'rgb(255, 255, 255)',
                borderRadius: borderRadius,
                boxSizing: 'content-box'
            }
        }
    );

    @flow.stateStep('shown', transition, layout.opacity(1))
    @flow.defaultState('hidden', transition, layout.stick.center(), layout.opacity(0), layout.translate(0, 0, 20))
    shadow = new Surface({
            properties: {
                boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.12)',
                backgroundColor: 'rgb(255, 255, 255)',
                borderRadius: borderRadius
            }
        }
    );

    @flow.stateStep('shown', flowOptions, ...showBubble)
    @flow.defaultState('hidden', closeTransition, ...hideBubble)
    correct = new FeedbackBubble({variation: 'correct'});

    @flow.stateStep('shown', flowOptions, ...showBubble)
    @flow.defaultState('hidden', closeTransition, ...hideBubble)
    incorrect = new FeedbackBubble({variation: 'incorrect'});

    @flow.defaultState('hidden', flowOptions, ...hideBubble)
    @flow.stateStep('shown', closeTransition, ...showBubble)
    required = new FeedbackBubble({variation: 'required'});



    /**
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
     */
    constructor(options) {
        super(combineOptions({required: false, usesFeedback: true}, options));

        if (!this.input) {
            this.addRenderable(new SingleLineInputSurface({
                value: this.options.value || '',
                type: this.options.password ? 'password' : 'text',
                placeholder: this.options.placeholder || '',
                properties: {
                    backgroundColor: 'transparent',
                    padding: this.options.usesFeedback ? '16px 48px 16px 16px' : '0px 16px 0px 16px',
                    borderRadius: borderRadius,
                    boxShadow: 'none',
                    ...TypeFaces.UIRegular
                }
            }), 'input', layout.dock.fill(), layout.translate(0, 0, 30), event.on('blur', function () {
                this._onBlur();
            }), event.on('focus', function () {
                    this._onFocus();
                }
            ));
        }

        if (this.options.required) {
            this.setRequiredState();
        }
    }

    setValue() {
        return this.input.setValue(...arguments);
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
        this.setViewFlowState('correct');
    }

    setIncorrectState(message = '') {
        if (message) {
            this.incorrect.setText(message);
        }
        this.setViewFlowState('incorrect');
    }

    setRequiredState() {
        this.setViewFlowState('required');
    }

    getValue() {
        return this.input.getValue();
    }

    setValue(value) {
        this.input.setValue(value);
    }

    getSize() {
        return [undefined, 48];
    }

    _onFocus() {
        this.setRenderableFlowState('shadow', 'shown');
        this.correct.collapse();
        this.incorrect.collapse();
        this.required.collapse();
    }

    _onBlur() {
        this.setRenderableFlowState('shadow', 'hidden');
    }
}