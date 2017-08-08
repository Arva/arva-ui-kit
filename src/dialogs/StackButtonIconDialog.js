/**
 * Created by manuel on 12/07/16.
 */

import {layout}                 from 'arva-js/layout/Decorators.js';

import {BaseDialog}             from './BaseDialog.js';
import {IconTextButton}         from '../buttons/IconTextButton.js';
import {LocationIcon}           from '../icons/LocationIcon.js';
import {Colors}                 from '../defaults/DefaultColors.js';

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

            this.addRenderable(new IconTextButton({
                    content: buttonText,
                    icon: LocationIcon,
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
        this.decorations.viewMargins = [newMargin, 0, 0, 0];
        if (this.button0) {
            this.button0.decorations.dock.space = newMargin;
        }

    }
}
