/**
 * Created by tom on 12/09/16.
 */

import Easing                   from 'famous/transitions/Easing.js';

import {View}                   from 'arva-js/core/View.js';
import {flow, layout}           from 'arva-js/layout/Decorators.js';
import {flowStates}             from 'arva-js/layout/FlowStates.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {SingleLineInputSurface} from './SingleLineInputSurface.js';
import {FeedbackBubble}         from './textInput/FeedbackBubble.js';

const flowOptions = {transition: {curve: Easing.outCubic, duration: 500}, delay: 0};

@flow.viewStates({
    correct: [{correct: 'shown', incorrect: 'hidden', required: 'hidden'}],
    required: [{correct: 'hidden', incorrect: 'hidden', required: 'shown'}],
    incorrect: [{correct: 'hidden', incorrect: 'shown', required: 'hidden'}]
})
export class SingleLineTextInput extends View {

    @layout.size(undefined, undefined)
    input = new SingleLineInputSurface({
        content: this.options.content || '',
        properties: {
            padding: '0px 48px 0px 8px'
        }
    });

    @layout.size(~40, 40)
    @layout.stick.right()
    @layout.translate(-4, 0, 50)
    @layout.opacity(0)
    @flow.stateStep('shown', flowOptions, layout.opacity(1))
    @flow.stateStep('hidden', flowOptions, layout.opacity(0))
    correct = new FeedbackBubble({variation: 'correct'});

    @layout.size(~40, 40)
    @layout.stick.right()
    @layout.translate(-4, 0, 40)
    @layout.opacity(0)
    @flow.stateStep('shown', flowOptions, layout.opacity(1))
    @flow.stateStep('hidden', flowOptions, layout.opacity(0))
    incorrect = new FeedbackBubble({variation: 'incorrect'});

    @layout.size(~40, 40)
    @layout.stick.right()
    @layout.translate(-4, 0, 20)
    @layout.opacity(0)
    @flow.stateStep('shown', flowOptions, layout.opacity(1))
    @flow.stateStep('hidden', flowOptions, layout.opacity(0))
    required = new FeedbackBubble({variation: 'required'});

    constructor(options) {
        super(combineOptions({required: true}, options));

        if (this.options.required) {
            this.setRequiredState();
        }

        window.x = this; // todo remove
    }

    setCorrectState(message = '') {
        if(message){
            this.correct.setText(message);
        }
        this.setViewFlowState('correct');
    }

    setIncorrectState(message = '') {
        if(message){
            this.incorrect.setText(message);
        }
        this.setViewFlowState('incorrect');
    }

    setRequiredState() {
        this.setViewFlowState('required');
    }


    getSize() {
        return [undefined, 48];
    }
}