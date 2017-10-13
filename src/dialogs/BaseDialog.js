/**
 * Created by lundfall on 12/07/16.
 */
import Surface              from 'famous/core/Surface.js';

import {Dialog}             from 'arva-js/components/Dialog.js';
import {View}               from 'arva-js/core/View.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {layout}             from 'arva-js/layout/Decorators.js';

import {CrossIcon}          from '../icons/CrossIcon.js';
import {ImageButton}        from '../buttons/ImageButton.js';
import {UITitle}            from '../defaults/DefaultTypefaces.js';
import {TextBody}           from '../defaults/DefaultTypefaces.js';

/**
 * A dialog wth a title and text
 */
export class BaseDialog extends Dialog {

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
    @layout.fullSize()
    background = new Surface({properties: {backgroundColor: 'white', borderRadius: '4px'}});

    @layout.size(48, 48)
    @layout.stick.topLeft()
    @layout.translate(4, 0, 0)
    closeButton = this.options.showCloseButton && new ImageButton({
        icon: CrossIcon,
        clickEventName: 'dialogClosed',
        variation: 'noShadow'
    });

    @layout.dock.top( ~50)
    @layout.stick.top()
    title = new Surface(combineOptions({ content: this.options.title, properties: { textAlign: "left", whitespace: "nowrap" } }, UITitle));

    @layout.stick.top()
    @layout.dock.top( ~50, 8)
    body = new Surface(combineOptions({ content: this.options.body, properties: { textAlign: 'left' } }, TextBody));

    /**
     * @example
     * Injection.get(DialogManager).show({dialog: new BaseDialog({title: "Welcome!}))
     *
     * @param {Object} options
     * @param {String} [options.title] The title of the dialog
     * @param {String} [options.body] The body of the dialog
     */
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


    getSize() {
        /* Specifies the size to be undefined on the width to make a full width dialog with wrapped height */
        return [undefined, super.getSize()[1]];
    }

    /**
     * Called when the margin is (re)calculated that is needed for the dialog
     * @param newMargin
     */
    onNewMargin(newMargin) {
        this.decorations.viewMargins = [newMargin, newMargin, newMargin, 0];
    }
}
