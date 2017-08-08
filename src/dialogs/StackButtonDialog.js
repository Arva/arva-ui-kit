/**
 * Created by lundfall on 12/07/16.
 */

import {layout}             from 'arva-js/layout/Decorators.js';

import {BaseDialog}         from './BaseDialog.js';
import {WhiteTextButton}         from '../buttons/WhiteTextButton.js';

export class StackButtonDialog extends BaseDialog {

    /**
     * @example
     * new StackButtonDialog({buttons: ['Button1', 'Button2', 'Button3'], title: 'Hello', body: 'World'})
     *
     * @param {Object} [options] Constructor options
     * @param {Array} [options.buttons] Array of button texts
     * @param {String} [options.title] The title of the Dialog
     * @param {String} [options.body] The body of the Dialog
     */
    constructor(options = {}) {
        options.borderRadius = options.rounded ? "24px" : "4px";
        super(options);
        let {buttons} = options;
        if (!buttons) {
            throw new Error("No buttons specified for dialog");
        }
        for (let [index, buttonText] of buttons.entries()) {
            let buttonHeight = 64;
            this.addRenderable(new WhiteTextButton({
                    content: buttonText,
                    disableBoxShadow: true,
                    clickEventName: `button${index}`,
                    clickEventData: [index],
                    backgroundProperties: {
                        borderTop: '1px #E6e6e6 solid',
                        borderRadius: index !== buttons.length - 1 ? '0px' : `0px 0px ${this.options.borderRadius} ${this.options.borderRadius}`
                    }
                }
            ), `button${index}`, layout.dock.top(buttonHeight, 0), layout.translate(0, 0, 100));
        }
    }

    onNewMargin(newMargin) {
        /* Set the space between text and buttons the same as the upper, left, and right margins */
        this.decorations.viewMargins = [newMargin, 0, 0, 0];
        if (this.button0) {
            this.button0.decorations.dock.space = newMargin;
        }
    }
}