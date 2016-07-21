/**
 * Created by manuel on 12/07/16.
 */
import Surface              from 'famous/core/Surface.js';

import {View}               from 'arva-js/core/View.js';
import {combineOptions}     from 'arva-js/utils/combineOptions.js';
import {layout}             from 'arva-js/layout/decorators.js';
import {UITitle}            from '../defaults/DefaultTypefaces.js';
import {UIRegular}          from '../defaults/DefaultTypefaces.js';

export class BaseNotification extends View {

    static get DEFAULT_SIZES(){
        return {
            size: [320, 320],
            maxSize: [480, undefined],
            maxTextSize: [320, undefined],
            margins: [0,16,0,16],
            textMargin: [32,32,32,32]
        }
    }

    @layout.translate(0, 0, -10)
    @layout.fullscreen
    background = new Surface({properties: {backgroundColor: 'white', borderRadius: '4px',
        boxShadow: `0px 0px 16px 0px rgba(0,0,0,0.12)`,
    }});

    @layout.dock('top', ~50, 8, 200)
    @layout.place('top')
    @layout.size(undefined, ~50)
    title = new Surface(combineOptions({content: this.options.title, properties: {textAlign: "left", whitespace: "nowrap"}}, UITitle));

    @layout.place('top')
    @layout.dock('top', ~50, 8, 200)
    @layout.size(undefined, ~50)

    body = new Surface(combineOptions({content: this.options.body, properties: {textAlign: 'left'}}, UIRegular));

    constructor(options) {
        super(options);
        this.layout.on('layoutstart', ({size}) => {
            /*Set the inner size of the items */
            this.title.decorations.size = [Math.max(size[0] - (BaseNotification.DEFAULT_SIZES.textMargin[1] *2), BaseNotification.DEFAULT_SIZES.maxTextSize[0]), ~BaseNotification.DEFAULT_SIZES.size[1]];
            this.body.decorations.size = this.title.decorations.size;
            let marginSize = Math.max((size[0] - this.title.decorations.size[0]) / 2, BaseNotification.DEFAULT_SIZES.margins[1]);

            /* If any child classes need to know about the new margin, call this function */
            this.onNewMargin(marginSize);
        });
    }

    /**
     * Called when the margin is (re)calculated that is needed for the notifications
     * @param newMargin
     */
    onNewMargin(newMargin) {
        this.decorations.viewMargins = [newMargin, newMargin, newMargin, newMargin];
    }
}
