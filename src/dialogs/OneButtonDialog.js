/**
 * Created by lundfall on 12/07/16.
 */

import {layout}             from 'arva-js/layout/Decorators.js';

import {BaseDialog}         from './BaseDialog.js';
import {TextButton}         from '../buttons/TextButton.js';

export class OneButtonDialog extends BaseDialog {

    /**
     * @example
     * new OneButtonDialog({button: {buttonText: 'Confirm'}, title: 'Hello', body: 'World'})
     *
     * @param {Object} [options] Constructor options
     * @param {String} [options.button.buttonText] The text for the button
     * @param {String} [options.title] The title of the Dialog
     * @param {String} [options.body] The body of the Dialog
     */
    constructor(options = {}) {
        super(options);
        let {button} = options;
        if (!button) {
            throw new Error("No button specified for dialog");
        }
        this.addRenderable(new TextButton({
                content: button.buttonText,
                disableBoxShadow: true,
                clickEventName: 'closeDialog',
                clickEventData: [button.clickEventData],
                backgroundProperties: {
                    borderTop: '1px #E6e6e6 solid',
                    borderRadius: '0px 0px 4px 4px'
                }
            }
        ), `button0`, layout.dock.top( button.buttonHeight || 64));
    }

    onNewMargin(newMargin) {
        /* Set the space between text and buttons the same as the upper, left, and right margins */
        this.decorations.viewMargins = [newMargin, 0, 0, 0];
        if (this.button0) {
            this.button0.decorations.dock.space = newMargin;
        }
    }
}