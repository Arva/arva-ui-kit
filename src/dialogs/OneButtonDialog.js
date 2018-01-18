/**
 * Created by lundfall on 12/07/16.
 */

import {layout}             from 'arva-js/layout/Decorators.js';

import {BaseDialog}         from './BaseDialog.js';
import {WhiteTextButton}         from '../buttons/WhiteTextButton.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

export class OneButtonDialog extends BaseDialog {

    /**
     * @example
     * new OneButtonDialog({button: {buttonText: 'Confirm'}, title: 'Hello', body: 'World'})
     *
     * @param {Object} [options] Constructor options
     * @param {String} [options.button.buttonText] The text for the button. Defaults to 'Ok'
     * @param {String} [options.title] The title of the Dialog
     * @param {String} [options.body] The body of the Dialog
     */
    constructor(options = {}) {
        options.borderRadius = options.rounded ? "24px" : "4px";
        super(combineOptions(options, {button: {buttonText: 'Ok'}}));
        let {button} = this.options;
        this.addRenderable(new WhiteTextButton({
                content: button.buttonText,
                disableBoxShadow: true,
                clickEventName: 'closeDialog',
                clickEventData: [button.clickEventData],
                backgroundProperties: {
                    borderTop: '1px #E6e6e6 solid',
                    borderRadius: `0px 0px ${options.borderRadius} ${options.borderRadius}`
                }
            }
        ), layout.dock.top( button.buttonHeight || 64).translate(0, 32,  0));
    }

    onNewMargin(newMargin) {
        /* Set the space between text and buttons the same as the upper, left, and right margins */
        this.decorations.viewMargins = [32, 0, 0, 0];
        if (this.button0) {
            this.button0.decorations.dock.space = 32;
        }
    }
}