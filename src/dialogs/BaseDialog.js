/**
 * Created by lundfall on 12/07/16.
 */
import Surface              from 'famous/core/Surface.js';

import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/decorators.js';

export class BaseDialog extends View {
    @layout.translate(0, 0, -10)
    @layout.fullscreen
    background = new Surface({properties: {backgroundColor: 'white', borderRadius: '4px'}});

    @layout.dock('top', ~50)
    @layout.place('top')
    title = new Surface({content: this.options.title, properties: {textAlign: 'center', whitespace: 'nowrap'}});

    @layout.place('top')
    @layout.dock('top', ~50, 8)
    body = new Surface({content: this.options.body, properties: {textAlign: 'center'}});
    
    constructor(options){
        super(options);
        this.layout.on('layoutstart', ({size}) => {
            let marginSize = Math.max((size[0] - 320)/2, 16);
            /*Set the inner size of the items */
            this.title.decorations.size = [Math.min(size[0] - 32, 320), ~50];
            this.body.decorations.size = [Math.min(size[0] - 32, 320), ~50];
            /* If any child classes need to know about the new margin, call this function */
            this.onNewMargin(marginSize);
        });
    }

    /**
     * Called when the margin is (re)calculated that is needed for the dialog
     * @param newMargin
     */
    onNewMargin(newMargin) {
        this.decorations.viewMargins = [newMargin, 0, newMargin, 0];
    }
}
