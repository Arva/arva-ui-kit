/**
 * Created by vlad on 19/09/16.
 */

import Surface                  from 'famous/core/Surface.js';
import {layout}                 from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {Clickable}              from './Clickable.js';
import {RadioButtonCircle}      from './RadioButtonCircle.js';
import {Colors}                 from '../defaults/DefaultColors.js';
import {UIRegular}              from '../defaults/DefaultTypefaces.js';

export class RadioButton extends Clickable {

    @layout.size(48, 48)
    @layout.dock.left()
    @layout.stick.left()
    @layout.translate(0, 0, 0)
    circle = new RadioButtonCircle({
        icon: this.options.icon,
        selected: this.options.selected
    });

    @layout.size(~100, 48)
    @layout.dock.left()
    @layout.dockSpace(16)
    @layout.stick.left()
    @layout.translate(0, 0, 0)
    text = new Surface(combineOptions(this.options.typeface || UIRegular, {
        content: this.options.text,
        properties: {
            lineHeight: '48px',
            color: this.options.selected ? this.options.activeColor : 'rgb(0, 0, 0)'
        }
    }));

    @layout.fullSize()
    @layout.translate(0, 0, 40)
    overlay = new Surface({properties: {cursor: 'pointer'}});

    constructor(options = {}) {
        super(combineOptions({
            activeColor: Colors.PrimaryUIColor
        }, options));
    }

    getSize() {
        return [undefined, 64];
    }

    select() {
        this.circle.select();
        this.text.setProperties({color: this.options.activeColor});
    }

    deselect() {
        this.circle.deselect();
        this.text.setProperties({color: 'rgb(0, 0, 0)'});
    }
}