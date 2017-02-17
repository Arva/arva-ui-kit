/**
 * Created by vlad on 14/02/2017.
 */

import {OverlayingButtons}          from './OverlayingButtons.js';
import {FloatingImageButton}        from 'arva-kit/buttons/FloatingImageButton.js';

export class OverlayingFloatingButtons extends OverlayingButtons {

    /**
     * Specialized version of OverlayingButtons using the FloatingImageButton
     *
     * @example
     * const overlayingFloatingButtons = Injection.provide(OverlayingFloatingButtons, new OverlayingFloatingButtons({
     *     buttons: [
     *         {
     *             backgroundColor: 'rgb(118, 20, 104)',
     *             icon: plus,
     *             persistent: false // todo implement later
     *         }, ...
     *     ],
     *     routes: {
     *         'Profile': {
     *             'Index': [0, 1, 2, 3],
     *             'Invoices': [3, 0],
     *             'Settings': [2, 1, 3]
     *         },
     *         'Home': {
     *             'Index': [0, 1, 2, 3],
     *             'AddContainer': [0, 1, 2, 3]
     *         }, ...
     *     }
     * }));
     *
     *
     * @param {Object} options Construction options
     * @param {Array} [options.buttons] Array containing the settings to be used for creating FloatingImageButtons.
     *        These settings include the icon and the background color.
     * @param {Object} [options.routes] Object containing the routes for which a specific set of buttons will be shown.
     *        It is passed directly to the OverlayingButtons class, so it functions in exactly the same way.
     */
    constructor(options = {}) {
        let floatingButtons = [];
        for (let [index, buttonSettings] of options.buttons.entries()) {
            floatingButtons.push({
                button: new FloatingImageButton({
                    imageSize: [24, 24],
                    icon: buttonSettings.icon,
                    backgroundProperties: {
                        backgroundColor: buttonSettings.backgroundColor
                    },
                    clickEventName: `button${index}`
                }),
                persistent: buttonSettings.persistent
            })
        }

        super({
            buttons: floatingButtons,
            routes: options.routes
        });
    }

}