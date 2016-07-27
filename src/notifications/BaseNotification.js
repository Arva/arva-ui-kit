/**
 * Created by manuel on 12/07/16.
 */
import Surface              from 'famous/core/Surface.js';

import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/decorators.js';
import {combineOptions}     from 'arva-js/utils/combineOptions.js';

import {UITitle}            from '../defaults/DefaultTypefaces.js';
import {UIRegular}          from '../defaults/DefaultTypefaces.js';

import {NotificationIcon}   from './NotificationIcon.js';

@layout.margins([24, 0, 24, 24])
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
    @layout.fullscreen
    background = new Surface({
        properties: {
            backgroundColor: 'white', borderRadius: '4px',
            boxShadow: `0px 0px 16px 0px rgba(0,0,0,0.12)`,
        }
    });

    @layout.dock('top', ~18, 8, 200)
    @layout.size(function () {
            return this.options.usesIcon ? 260 : 324
        }
        , ~50)
    title = new Surface(combineOptions({
        content: this.options.title,
        properties: {textAlign: "left", whitespace: "nowrap", wordBreak: 'break-word'}
    }, UITitle));

    @layout.dock('top', ~18, 8, 200)
    @layout.size(function () {
            return this.options.usesIcon ? 260 : 324
        }
        , ~50)
    body = new Surface(combineOptions({
        content: this.options.body,
        properties: {textAlign: 'left', wordBreak: 'break-word'}
    }, UIRegular));

    constructor(options) {
        super(combineOptions({
                usesIcon: options.type === 'action'
            }, options
        ));

        this.usesIcon = this.options.usesIcon;

        if (this.usesIcon) {
            this.addRenderable(new NotificationIcon(), 'icon', layout.place('right'), layout.size(64, (size)=>size), layout.translate(0, 0, 220));
            this.icon.on('click', ()=> {
                this._eventOutput.emit('close');
            });
        }
    }
}
