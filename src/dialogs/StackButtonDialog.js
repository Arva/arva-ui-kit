/**
 * Created by lundfall on 12/07/16.
 */

import {layout}             from 'arva-js/layout/decorators.js';

import {BaseDialog}         from './BaseDialog.js';
import {TextButton}         from '../buttons/TextButton.js';

export class StackButtonDialog extends BaseDialog {
    constructor(options = {}) {
        super(options);
        let {buttons} = options;
        if (!buttons) {
            throw new Error("No buttons specified for dialog");
        }
        for (let [index, buttonText] of buttons.entries()) {
            let buttonHeight = 64;
            this.addRenderable(new TextButton({
                    content: buttonText,
                    disableBoxShadow: true,
                    clickEventName: 'closeDialog',
                    clickEventData: [index],
                    backgroundProperties: {
                        borderTop: '1px #E6e6e6 solid',
                        borderRadius: index !== buttons.length - 1 ? '0px' : '0px 0px 4px 4px'
                    }
                }
            ), `button${index}`, layout.dock('top', buttonHeight));
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