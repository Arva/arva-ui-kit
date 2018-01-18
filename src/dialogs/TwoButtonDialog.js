/**
 * Created by lundfall on 12/07/16.
 */

import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import {BaseDialog}         from './BaseDialog.js';
import {WhiteTextButton}         from '../buttons/WhiteTextButton.js';

export class TwoButtonDialog extends BaseDialog {

    @layout.dock.top( 64, 0, 0)
    bottomView = new BottomButtonView(this.options);

    /**
     * @example
     * new TwoButtonDialog({buttonLeft: {buttonText: 'Deny'},buttonRight: {buttonText: 'Confirm'}, title: 'Hello', body: 'World'})
     *
     * @param {Object} [options] Constructor options
     * @param {String} [options.buttonLeft.buttonText] The text for the left button
     * @param {String} [options.buttonRight.buttonText] The text for the right button
     * @param {String} [options.title] The title of the Dialog
     * @param {String} [options.body] The body of the Dialog
     */
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
    buttonLeft = new WhiteTextButton(this.options.buttonLeft);

    @layout.dock.right()
    @layout.size((size)=>(Math.floor(size/2)), 64)
    buttonRight = new WhiteTextButton(this.options.buttonRight);

    constructor(options) {
        options.borderRadius = options.rounded ? "24px" : "4px";
        super(combineOptions({
            buttonLeft: {
                disableBoxShadow: true,
                clickEventName: 'closeDialog',
                backgroundProperties: {
                    borderTop: '1px #E6e6e6 solid',
                    borderRadius: `0px 0px 0px ${options.borderRadius}`,
                    borderRight: '1px #E6e6e6 solid'
                }
            },
            buttonRight: {
                disableBoxShadow: true,
                clickEventName: 'closeDialog',
                backgroundProperties: {
                    borderTop: '1px #E6e6e6 solid',
                    borderRadius: `0px 0px ${options.borderRadius} 0px`
                }
            }
        }, options));
    }
}