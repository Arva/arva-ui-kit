/**
 * Created by manuel on 12/07/16.
 */
import Surface              from 'famous/core/Surface.js';

import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/combineOptions.js';
import {UITitle}            from '../defaults/DefaultTypefaces.js';
import {UIRegular}          from '../defaults/DefaultTypefaces.js';

import {NotificationIcon}   from './NotificationIcon.js';

@layout.dockPadding(24, 0, 24, 24)
export class BaseNotification extends View {

    static get DEFAULT_SIZES() {
        return {
            size: [320, 320],
            maxSize: [480, undefined],
            maxTextSize: [320, undefined],
            margins: [0, 16, 0, 16],
            textMargin: [32, 32, 32, 32]
        }
    }

    @layout.translate(0, 0, -10)
    @layout.fullSize()
    background = new Surface({
        properties: {
            backgroundColor: 'white', borderRadius: '4px',
            boxShadow: `0px 0px 16px 0px rgba(0,0,0,0.12)`,
        }
    });

    @layout.dock.top(~18, 8, 200)
    @layout.size(function () {
            return this.options.usesIcon ? 260 : 324
        }
        , ~50)
    title = new Surface(combineOptions({
        content: this.options.title,
        properties: {textAlign: "left", whitespace: "nowrap", wordBreak: 'break-word'}
    }, UITitle));

    @layout.dock.top(~18, 8, 200)
    @layout.size(function () {
            return this.options.usesIcon ? 260 : 324
        }
        , ~50)
    body = new Surface(combineOptions({
        content: this.options.body,
        properties: {textAlign: 'left', wordBreak: 'break-word'}
    }, UIRegular));

    /**
     * A base notification view for displaying notifications. This class is ment to be extended for different Notification layouts
     *
     * @example
     * @layout.dock.top(~48, 8)
     * notification = new BaseNotification({
     *  type: 'auto',
     *  title: 'Title',
     *  body: 'Body',
     *  action: 'Confirm',
     *  usesIcon: false
     * });
     *
     * @param {Object} [options] Construction options
     * @param {Boolean} [options.usesIcon] Whether the Notification should show an icon
     * @param {String} [options.title] Title of the notification
     * @param {String} [options.body] Body of the notification
     * @param {String} [options.action] Type of action that gets shown, when type is 'action'
     * @param {String} [options.type] Type of the notifications, action | auto
     */
    constructor(options) {
        super(combineOptions({
                usesIcon: options.type === 'action'
            }, options
        ));

        this.usesIcon = this.options.usesIcon;

        if (this.usesIcon) {
            this.addRenderable(new NotificationIcon(), 'icon', layout.stick.right(), layout.size(64, (_, height)=>height), layout.translate(0, 0, 220));
            this.icon.on('click', ()=> {
                this._eventOutput.emit('close');
            });
        }
    }
}
