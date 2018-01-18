/**
 * Created by manuel on 12/07/16.
 */

import {layout}                 from 'arva-js/layout/Decorators.js';

import {BaseDialog}             from './BaseDialog.js';
import {WhiteIconTextButton}         from '../buttons/WhiteIconTextButton.js';
import {ArrowrightIcon}           from '../icons/ArrowrightIcon.js';
import {Colors}         from '../defaults/DefaultColors.js';

export class StackButtonIconDialog extends BaseDialog {

    _buttons = [];


    /**
     * @example
     * new StackButtonIconDialog({buttons: ['Button1', 'Button2', 'Button3'], title: 'Hello', body: 'World'})
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

            this._buttons.push(`button${index}`);

            this[`button${index}`] = this.addRenderable(new WhiteIconTextButton({
                    content: buttonText,
                    icon: ArrowrightIcon,
                    properties: {
                        color: Colors.PrimaryUIColor
                    },
                    disableBoxShadow: true,
                    clickEventName: 'closeDialog',
                    clickEventData: [index],
                    backgroundProperties: {
                        borderTop: '1px #E6e6e6 solid',
                        borderRadius: index !== buttons.length - 1 ? '0px' : `0px 0px ${this.options.borderRadius} ${this.options.borderRadius}`
                    }
                }
            ), `button${index}`, layout.dock.top(buttonHeight));
        }
    }

    onNewMargin(newMargin) {

        /* Set the space between text and buttons the same as the upper, left, and right margins */
        this.decorations.viewMargins = [32, 0, 0, 0];
        if (this.button0) {
            this.button0.decorations.dock.space = 32;
        }

        for (let button of this._buttons) {
            this[button].iconAndText.icon.decorations.translate[0] = newMargin - 12;
            this[button].iconAndText.text.decorations.translate[0] = newMargin;
        }


    }
}
