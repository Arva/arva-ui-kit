/**
 * Created by vlad on 19/09/16.
 */

import {Surface}        from 'arva-js/surfaces/Surface.js';
import {Clickable}              from '../Clickable.js';
import {RadioButtonCircle}      from './RadioButtonCircle.js';
import {UIRegular}              from '../../text/UIRegular.js';
import {layout, bindings}       from 'arva-js/layout/Decorators.js';

@bindings.setup({
    selected: false
})
export class RadioButton extends Clickable {

    @layout.size(48, 48)
        @layout.dock.left()
        @layout.stick.left()
        @layout.translate(0, 0, 0)
    circle = RadioButtonCircle.with({
        icon: this.options.icon,
        selected: this.options.selected
    });

    @layout.size(undefined, 48)
        .dock.left()
        .dockSpace(16)
        .stick.left()
        .translate(0, 0, 0)
    text = UIRegular.with({
        content: this.options.text,
        properties: {
            lineHeight: '48px',
            whiteSpace: 'nowrap'
        }
    });

    @layout.fullSize()
        .translate(0, 0, 60)
    overlay = new Surface({properties: {cursor: 'pointer'}});


    _handleTapEnd() {
        this.options.selected = true;
        this._eventOutput.emit('chosen');
    }
    getSize() {
        return [undefined, 64];
    }
}