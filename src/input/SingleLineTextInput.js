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

let {searchBar: {borderRadius}} = Dimensions;
const transition = { transition: { curve: Easing.outCubic, duration: 200 }, delay: 0 };
const closeTransition = { transition: { curve: Easing.outCubic, duration: 200 }, delay: 0 };
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

    @layout.dock.fill()
    @layout.translate(0, 0, 30)
    @event.on('blur', function() { this._onBlur(); })
    @event.on('focus', function() { this._onFocus(); })
    input = new SingleLineInputSurface({
        content: this.options.content || '',
        properties: {
            backgroundColor: 'transparent',
            padding: '0px 16px 0px 16px',
            borderRadius: borderRadius,
            boxShadow: 'none'
        }
    });

    @flow.stateStep('shown', flowOptions, ...showBubble)
    @flow.defaultState('hidden', closeTransition, ...hideBubble)
    correct = new FeedbackBubble({variation: 'correct'});

    @flow.stateStep('shown', flowOptions, ...showBubble)
    @flow.defaultState('hidden', closeTransition,...hideBubble)
    incorrect = new FeedbackBubble({variation: 'incorrect'});

    @flow.defaultState('shown', flowOptions, ...showBubble)
    @flow.stateStep('hidden', closeTransition, ...hideBubble)
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