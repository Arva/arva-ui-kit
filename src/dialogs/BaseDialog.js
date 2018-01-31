/**
 * Created by lundfall on 12/07/16.
 */
import {Surface}            from 'arva-js/surfaces/Surface.js';

import {Dialog}             from 'arva-js/components/Dialog.js';
import {View}               from 'arva-js/core/View.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {layout, bindings}   from 'arva-js/layout/Decorators.js';

import {CrossIcon}          from '../icons/CrossIcon.js';
import {WhiteIconButton}    from '../buttons/WhiteIconButton.js';
import {UITitle}            from '../text/UITitle.js';
import {Text}               from '../text/Text.js';


/**
 * A dialog wth a title and text
 *
 * @example
 * dialogManager.show({dialog: new BaseDialog({title: "Welcome!}))
 *
 * @param {Object} options
 * @param {String} [options.title] The title of the dialog
 * @param {String} [options.body] The body of the dialog
 */
@bindings.setup({
    titleProperties: {
        textAlign: "left", whitespace: "nowrap"
    },
    bodyProperties: {
        textAlign: 'left'
    },
    backgroundProperties: {
        backgroundColor: 'white',
        borderRadius: '4px'
    },
    title: '',
    body: ''
})
@layout.columnDockPadding(320, [32, 32, 0, 32])
export class BaseDialog extends Dialog {

    @bindings.trigger()
    roundCornersIfNeeded() {
        if(this.options.rounded){
            this.options.backgroundProperties.borderRadius = '24px';
        }
    }

    @layout.translate(0, 0, -10)
    @layout.fullSize()
    background = new Surface({properties: this.options.backgroundProperties });

    @layout.size(48, 48)
    @layout.stick.topLeft()
    @layout.translate(4, 0, 0)
    closeButton = this.options.showCloseButton && new WhiteIconButton({
        icon: CrossIcon,
        clickEventName: 'dialogClosed',
        variation: 'noShadow'
    });


    @layout.dock.top( ~50)
        .stick.top()
    title = new UITitle({ content: this.options.title, properties: this.options.titleProperties });

    @layout.stick.top()
        .dock.top( ~50, 8)
    body = new Text({ content: this.options.body, properties: this.options.bodyProperties });



    getSize() {
        /* Specifies the size to be undefined on the width to make a full width dialog with wrapped height */
        return [undefined, super.getSize()[1]];
    }
}
