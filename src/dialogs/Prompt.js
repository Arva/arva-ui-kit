/**
 * Created by lundfall on 16/05/2017.
 */

/**
 * Created by lundfall on 15/02/2017.
 */
import {Injection}                                      from 'arva-js/utils/Injection.js';
import {DialogManager}                                  from 'arva-js/utils/DialogManager.js';
import {ButtonDialog}                                from 'arva-kit/dialogs/ButtonDialog.js';
import {ConfirmationDialog}                             from './ConfirmationDialog';


/**
 * Class for avoiding repeating boiler plate for showing dialogs
 */

export class Prompt {

    /**
     *
     * @param {String} title
     * @param {String} body
     * @returns {Promise.<void>}
     */
    static async message({ title, body }) {
        if (!this._dialogManager) {
            this._dialogManager = Injection.get(DialogManager);
        }
        this._dialogManager.show({
            dialog: new ButtonDialog({
                title,
                body
            })
        });
        await this._dialogManager.dialogComplete();
    }

    /**
     *
     * @param title
     * @param body
     * @param confirmText
     * @param cancelText
     * @returns {Promise.<*>}
     */
    static async confirmation({ title, body, confirmText, cancelText }) {
        if (!this._dialogManager) {
            this._dialogManager = Injection.get(DialogManager);
        }
        let dialog = new ConfirmationDialog({
            title,
            body,
            confirmText,
            cancelText
        });
        this._dialogManager.show({
            dialog
        });
        let chosenOption = await dialog.once('closeDialog');
        this._dialogManager.close();
        return chosenOption;
    }

    /**
     *
     * @param title
     * @param body
     * @param labels
     * @returns {Promise.<*>}
     */
    static async multipleOptions({ title, body, labels}) {
        labels = labels || [];
        if (!this._dialogManager) {
            this._dialogManager = Injection.get(DialogManager);
        }
        let dialog = new ButtonDialog({
            title,
            body,
            buttons: labels.map((text) => ({content: text}))
        });
        this._dialogManager.show({
            dialog
        });
        let chosenOption = await dialog.once('closeDialog');
        this._dialogManager.close();
        return chosenOption;
    }

}