import {ButtonDialog} from './ButtonDialog';

import {layout, bindings, event, dynamic}   from 'arva-js/layout/Decorators.js';
import {WhiteTextButton} from 'arva-kit/buttons/WhiteTextButton.js';


@bindings.setup({
    stackHorizontal: true,
        title: 'Are you sure?',
    body: 'Please confirm action.',
    buttonType: WhiteTextButton,
    confirmText: 'Confirm',
    cancelText: 'Cancel'
})
export class ConfirmationDialog extends ButtonDialog {
    @bindings.trigger()
    setButtons() {
        this.options.buttons =  [
            {content: this.options.cancelText, bold: false,  clickEventName: 'cancel', clickEventData: ['cancel']},
            {content: this.options.confirmText, clickEventName: 'confirm', clickEventData: ['confirm']},
        ]
    }

    constructor(options){
        super(options);
        this.on('confirm', () => this._eventOutput.emit('closeDialog'));
        this.on('cancel', () => this._eventOutput.emit('closeDialog'));
    }

}