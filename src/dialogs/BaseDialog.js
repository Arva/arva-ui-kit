/**
 * Created by lundfall on 12/07/16.
 */
import Surface              from 'famous/core/Surface.js';

import {View}               from 'arva-js/core/View.js';
import {combineOptions}     from 'arva-js/utils/combineOptions.js';
import {layout}             from 'arva-js/layout/decorators.js';
import {UITitle}            from '../defaults/DefaultTypefaces.js';
import {UIRegular}          from '../defaults/DefaultTypefaces.js';

export class BaseDialog extends View {

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
    background = new Surface({properties: {backgroundColor: 'white', borderRadius: '4px'}});

    @layout.dock('top', ~50)
    @layout.place('top')
    title = new Surface(combineOptions({content: this.options.title, properties: {textAlign: "left", whitespace: "nowrap"}}, UITitle));

    @layout.place('top')
    @layout.dock('top', ~50, 8)
    body = new Surface(combineOptions({content: this.options.body, properties: {textAlign: 'left'}}, UIRegular));

    constructor(options) {
        super(options);
        this.layout.on('layoutstart', ({size}) => {

            /*Set the inner size of the items */
            this.title.decorations.size = [Math.min(size[0] - (BaseDialog.DEFAULT_SIZES.textMargin[1] *2), BaseDialog.DEFAULT_SIZES.maxTextSize[0]), ~BaseDialog.DEFAULT_SIZES.size[1]];
            this.body.decorations.size = this.title.decorations.size;
            let marginSize = Math.max((size[0] - this.title.decorations.size[0]) / 2, BaseDialog.DEFAULT_SIZES.margins[1]);

            /* If any child classes need to know about the new margin, call this function */
            this.onNewMargin(marginSize);
        });
    }

    /**
     * Called when the margin is (re)calculated that is needed for the dialog
     * @param newMargin
     */
    onNewMargin(newMargin) {
        this.decorations.viewMargins = [newMargin, newMargin, newMargin, 0];
    }
}
