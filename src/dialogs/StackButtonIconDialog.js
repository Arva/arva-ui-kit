/**
 * Created by manuel on 12/07/16.
 */

import {layout}                 from 'arva-js/layout/decorators.js';

import {BaseDialog}             from './BaseDialog.js';
import {IconButton}        from '../buttons/IconButton.js';
import {LocationIcon}           from '../icons/angular/bold/LocationIcon.js';
import {PrimaryUIColor}         from '../defaults/DefaultColors.js';

export class StackButtonIconDialog extends BaseDialog {

    _buttons = [];

    constructor(options) {
        super(options);

        let {buttons} = options;
        if (!buttons) {
            throw new Error("No buttons specified for dialog");
        }
        for (let [index, buttonText] of buttons.entries()) {
            let buttonHeight = 64;

            this._buttons.push(`button${index}`);

            this.addRenderable(new IconButton({
                    content: buttonText,
                    icon: LocationIcon,
                    properties: {
                        color: PrimaryUIColor
                    },
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

        console.log(newMargin);
        /* Set the space between text and buttons the same as the upper, left, and right margins */
        this.decorations.viewMargins = [newMargin, 0, 0, 0];
        if (this.button0) {
            this.button0.decorations.dock.space = newMargin;
        }

        for(let button of this._buttons){
            this[button].icon.decorations.translate = [newMargin-12, 0, 0];
            this[button].text.decorations.translate = [newMargin, 0, 0];

        }


    }
}
