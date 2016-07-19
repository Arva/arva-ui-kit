/**
 * Created by lundfall on 12/07/16.
 */

import {layout}             from 'arva-js/layout/decorators.js';

import {BaseDialog}         from './BaseDialog.js';
import {TextButton}         from '../buttons/TextButton.js';

export class TwoButtonDialog extends BaseDialog {
    constructor(options) {
        super(options);
        let {buttonLeft, buttonRight} = options;
        if (!buttonLeft || buttonLeft) {
            throw new Error("No button specified for dialog");
        }

        this.addRenderable(new TextButton({
                content: buttonLeft.buttonText,
                disableBoxShadow: true,
                clickEventName: 'closeDialog',
                clickEventData: [buttonLeft.clickEventData],
                backgroundProperties: {
                    borderTop: '1px #E6e6e6 solid',
                    borderRadius: '0px 0px 4px 4px'
                }
            }
        ), `buttonLeft`, layout.dock('left', buttonLeft.buttonHeight || 64));

        this.addRenderable(new TextButton({
                content: buttonRight.buttonText,
                disableBoxShadow: true,
                clickEventName: 'closeDialog',
                clickEventData: [buttonRight.clickEventData],
                backgroundProperties: {
                    borderTop: '1px #E6e6e6 solid',
                    borderRadius: '0px 0px 4px 4px'
                }
            }
        ), `buttonRight`, layout.dock('right', buttonRight.buttonHeight || 64));
    }

    onNewMargin(newMargin) {
        /* Set the space between text and buttons the same as the upper, left, and right margins */
        this.decorations.viewMargins = [newMargin, 0, 0, 0];
        if (this.buttonLeft) {
            this.button0.decorations.dock.space = newMargin;
        }
        if (this.buttonRight) {
            this.button0.decorations.dock.space = newMargin;
        }
    }
}