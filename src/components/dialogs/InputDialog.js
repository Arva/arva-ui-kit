/**
 * Created by Manuel on 14/07/16.
 */

import {layout}                 from 'arva-js/layout/decorators.js';

import {BaseDialog}             from './BaseDialog.js';
import {TextButton}             from '../buttons/TextButton.js';
import {SingleLineInputSurface} from "../../surfaces/input/SingleLineInputSurface";

export class InputDialog extends BaseDialog {

    @layout.dock('top', ()=> this.options.buttonHeight || 64)
    button = new TextButton({
        content: this.options.buttonText,
        disableBoxShadow: true,
        clickEventName: 'submit',
        backgroundProperties: {
            borderTop: '1px #E6e6e6 solid'
        }
    });

    @layout.dock('top', ()=> this.options.buttonHeight || 64)
    input = new SingleLineInputSurface({
        placeholder: this.options.inputText || 'input'
    });
}