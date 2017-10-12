/**
 * Created by lundfall on 16/05/2017.
 */

/**
 * Created by lundfall on 15/02/2017.
 */
import {Injection}                                      from 'arva-js/utils/Injection.js';
import {DialogManager}                                  from 'arva-js/utils/DialogManager.js';
import {OneButtonDialog}                                from 'arva-kit/dialogs/OneButtonDialog.js';
import {TwoButtonDialog}                                from 'arva-kit/dialogs/TwoButtonDialog.js';

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
    static async show({ title, body }) {
        if (!this._dialogManager) {
            this._dialogManager = Injection.get(DialogManager);
        }
        this._dialogManager.show({
            dialog: new OneButtonDialog({
                title,
                body,
                button: { buttonText: 'Ok' }
            })
        });
        await this._dialogManager.dialogComplete();
    }

    /**
     *
     * @example
     * async confirm() {
     *  let chosenAnswer = await Prompt.showTwoButtonDialog({
     *      title: 'Are you sure?',
     *      body: 'This will delete all your files',
     *      leftButton: 'Cancel',
     *      rightButton: 'Go ahead'
     *  })
     *  if(chosenAnswer === 'right') {
     *      this.deleteAll()
     *   }
     * }
     *
     * @param title
     * @param body
     * @param leftButton
     * @param rightButton
     * @returns {Promise.<*>} Resolves to either 'left' or 'right' depending on the clicked button
     */
    static async showTwoButtonDialog({ title, body, leftButton, rightButton }) {
        if (!this._dialogManager) {
            this._dialogManager = Injection.get(DialogManager);
        }
        let dialog = new TwoButtonDialog({
            title,
            body,
            buttonLeft: {content: leftButton, clickEventName: 'buttonClick', clickEventData: ['left']},
            buttonRight: {content: rightButton, clickEventName: 'buttonClick', clickEventData: ['right']}
        });
        this._dialogManager.show({
            dialog
        });
        let chosenOption = await dialog.once('buttonClick');
        this._dialogManager.close();
        return chosenOption;
    }

}