/**
 * Created by Manuel on 18/08/16.
 */
import Surface                      from 'famous/core/Surface.js';
import Easing                       from 'famous/transitions/Easing.js';
import AutosizeTextareaSurface      from 'famous-autosizetextarea/AutosizeTextareaSurface.js';

import {View}                       from 'arva-js/core/View.js';
import {flow, layout, event}        from 'arva-js/layout/decorators.js';
import {combineOptions}             from 'arva-js/utils/CombineOptions.js';
import {FeedbackBubble}             from './textInput/FeedbackBubble.js';
import {replaceEmojiAtEnd}          from './Emoji.js';


import {Dimensions}                 from '../defaults/DefaultDimensions.js';
let {searchBar: {borderRadius}} = Dimensions;

const transition = { transition: { curve: Easing.outCubic, duration: 200 }, delay: 0 };
const flowOptions = {transition: {curve: Easing.outCubic, duration: 300}, delay: 0};
const closeTransition = { transition: { curve: Easing.outCubic, duration: 200 }, delay: 0 };
const showBubble = [layout.size(~40, 40), layout.dock.right(), layout.stick.left(), layout.translate(0, 0, 110)];
const hideBubble = [layout.dock.none(), layout.dockSpace(8), layout.stick.right(), layout.size(~40, 40), layout.translate(0, 0, -20)];


export class MultiLineTextInput extends View {

    @layout.size(undefined, undefined)
    @layout.translate(0,0,100)
    @layout.stick.center()
    @event.on('blur', function() { this._onBlur(); })
    @event.on('focus', function() { this._onFocus(); })
    input = new AutosizeTextareaSurface(this.options);

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
    @flow.defaultState('hidden', closeTransition,...hideBubble)
    incorrect = new FeedbackBubble({variation: 'incorrect'});

    @flow.defaultState('shown', flowOptions, ...showBubble)
    @flow.stateStep('hidden', closeTransition, ...hideBubble)
    required = new FeedbackBubble({variation: 'required'});


    constructor(options = {}) {
        super(combineOptions({
            initialHeight: 50,
            clearOnEnter: false,
            emojiEnabled: true,
            placeholder: 'Enter comment',
            type: 'text',
            maxHeight: 150,
            properties: {
                backgroundColor: 'transparent',
                padding: '0px 16px 0px 16px',
                border: '0px transparent',
                borderRadius: borderRadius,
                boxShadow: 'none',
                resize: 'none',
                outline: 'none',
                overflow: 'hidden'
            }
        }, options));

        /* Set properties specificly as resize property is not set on construction */
        this.input.setProperties(this.options.properties);
        this.input.on('scroll', () => {
            if(this._savedHeight !== this.options.maxHeight) {
                this.scrollToTop();
            }
        });

        this.input.on('scrollHeightChanged', (scrollHeight)=> {
            if (scrollHeight < this.options.initialHeight) scrollHeight = this.options.initialHeight;
            this.reflowRecursively();
            this._savedHeight = scrollHeight > this.options.maxHeight ? this.options.maxHeight : scrollHeight;
            if(this._savedHeight === this.options.maxHeight){
                this.input.setProperties({ overflow: 'scroll'});
            } else {
                this.input.setProperties({ overflow: 'hidden'});
            }
        });

        this.input.on('keyup', this._onKeyUp);
        this.input.on('paste', this._onFieldChange);
        this.input.on('input', this._onFieldChange);
        this.input.on('propertychange', this._onFieldChange);
    }

    getSize() {
        return [undefined, this._savedHeight || this.options.initialHeight]
    }

    scrollToTop() {
        this.input._element.scrollTop = 0
    }

    _onKeyUp(event) {
        let keyCode = event.keyCode;

        if (keyCode === 13) {
            this._onMessageComplete();
        }
    }

    _onMessageComplete() {
        let message = this.getValue();
        if (!message) return;

        if (this.options.clearOnEnter) {
            this.input.setValue('');
        }

        this._eventOutput.emit('message', message);
    }

    _onFieldChange() {
        let currentValue = this.getValue();
        if (currentValue != this.input._value) {
            if (this.options.emojiEnabled && typeof currentValue === 'string') {
                currentValue = replaceEmojiAtEnd(currentValue);
                this.setValue(currentValue);
            }

            this.input._value = currentValue;
            if (this.options.isFormField) {
                this._setBorderBottomColor(currentValue);
            }
        }
    }

    setValue() {
        this.input.setValue(...arguments);
    }

    getValue() {
        let message = this.input.getValue();
        message = message.trim();
        if (message === '' || message === undefined || message === "\r\n" || message === "\n" || message === "\r") {
            return false;
        }
        return message;
    }

    _onFocus() {
        this.setRenderableFlowState('shadow', 'shown');
        this.correct.collapse();
        this.incorrect.collapse();
        this.required.collapse();

        this.focus();
    }

    _onBlur() {
        this.setRenderableFlowState('shadow', 'hidden');

        this.blur();
    }

    blur() {
        return this.input.blur();
    }

    focus() {
        return this.input.focus();
    }
}