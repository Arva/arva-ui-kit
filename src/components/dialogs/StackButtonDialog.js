/**
 * Created by lundfall on 12/07/16.
 */

import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/decorators.js';

import {BaseDialog}         from './BaseDialog.js';
import {Button}             from '../buttons/Button.js';

export class StackButtonDialog extends BaseDialog {
    constructor(options){
        super(options);
        let {buttons} = options;
        if(!buttons){
            throw new Error("No buttons specified for dialog");
        }
        for(let [index, buttonText] of buttons.entries()){
            let buttonHeight = 64;
            this.addRenderable(new Button({
                    content: buttonText,
                    properties: {
                        textAlign: 'center',
                        fontWeight: 'bold',
                        lineHeight: `${buttonHeight}px`
                    },
                    disableBoxShadow: true,
                    backgroundProperties: {
                        borderTop: '1px #E6e6e6 solid'
                    }
                }
            ),`button${index}`, layout.dock('top', buttonHeight));
        }
    }

    onNewMargin(newMargin) {
        /* Set the space between text and buttons the same as the upper, left, and right margins */
        if(this.button0){
            this.button0.decorations.dock.space = newMargin;
        }
    }
}