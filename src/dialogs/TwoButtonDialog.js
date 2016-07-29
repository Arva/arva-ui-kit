/**
 * Created by lundfall on 12/07/16.
 */

import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';

import {BaseDialog}         from './BaseDialog.js';
import {TextButton}         from '../buttons/TextButton.js';

export class TwoButtonDialog extends BaseDialog {

    @layout.dock.top( 64, 0, 0)
    bottomView = new BottomButtonView(this.options);

    constructor(options = {}) {
        super(options);
        let {buttonLeft, buttonRight} = options;
        if (!buttonLeft || !buttonRight) {
            throw new Error("No button specified for dialog");
        }
    }

    onNewMargin(newMargin) {
        /* Set the space between text and buttons the same as the upper, left, and right margins */
        this.decorations.viewMargins = [newMargin, 0, 0, 0];
        if (this.bottomView) {
            this.bottomView.decorations.dock.space = newMargin;
        }
    }
}

class BottomButtonView extends View{

    @layout.dock.left()
    @layout.size((size)=>(Math.floor(size/2)), 64)
    buttonLeft = new TextButton({
        content: this.options.buttonLeft.buttonText,
        disableBoxShadow: true,
        clickEventName: 'closeDialog',
        clickEventData: [this.options.buttonLeft.clickEventData],
        backgroundProperties: {
            borderTop: '1px #E6e6e6 solid',
            borderRadius: '0px 0px 0px 4px',
            borderRight: '1px #E6e6e6 solid'
        }
    });

    @layout.dock.right()
    @layout.size((size)=>(Math.floor(size/2)), 64)
    buttonRight = new TextButton({
        content: this.options.buttonRight.buttonText,
        disableBoxShadow: true,
        clickEventName: 'closeDialog',
        clickEventData: [this.options.buttonRight.clickEventData],
        backgroundProperties: {
            borderTop: '1px #E6e6e6 solid',
            borderRadius: '0px 0px 4px 0px'
        }
    });

}