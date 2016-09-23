/**
 * Created by tom on 23/09/16.
 */

import Surface                  from 'famous/core/Surface.js';
import {View}                   from 'arva-js/core/View.js';
import {layout}                 from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {UISmallGrey}            from '../text/UISmallGrey.js';
import {SingleLineTextInput}    from './SingleLineTextInput.js';

export class LabeledTextInput extends View {

    @layout.dock.top(~20)
    label = new UISmallGrey({content: this.options.label});

    @layout.dock.top(~48)
    @layout.dockSpace(4)
    input = new this.options.inputType({value: this.options.value, placeholder: this.options.placeholder, usesFeedback: this.options.usesFeedback});

    /**
     * Renders a SingleLineTextInput or MultiLineInput, with a text label docked above it.
     *
     * @param {Object} [options] Construction options
     * @param {String} [options.label] Label to show above input field
     * @param {Boolean} [options.usesFeedback] Set to true to enable required/correct/incorrect feedback bubbles. Disabled by default.
     * @param {String} [options.value] Value to initialise text input field with
     * @param {String} [options.placeholder] Placeholder to show when no input is present in the text field
     */
    constructor(options = {}) {
        super(combineOptions({
            label: 'Label',
            usesFeedback: false,
            value: '',
            placeholder: '',
            inputType: SingleLineTextInput
        }, options));
    }
}    