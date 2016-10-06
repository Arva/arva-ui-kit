/**
 * Created by vlad on 19/09/16.
 */

import Surface                  from 'famous/core/Surface.js';
import {layout}                 from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {Clickable}              from '../Clickable.js';
import {RadioButtonCircle}      from './RadioButtonCircle.js';
import {Colors}                 from '../../defaults/DefaultColors.js';
import {UIRegular}              from '../../defaults/DefaultTypefaces.js';

export class RadioButton extends Clickable {

    @layout.size(48, 48)
    @layout.dock.left()
    @layout.stick.left()
    @layout.translate(0, 0, 0)
    circle = new RadioButtonCircle({
        icon: this.options.icon
    });

    @layout.size(undefined, 48)
    @layout.dock.left()
    @layout.dockSpace(16)
    @layout.stick.left()
    @layout.translate(0, 0, 0)
    text = new Surface(combineOptions(this.options.typeface || UIRegular, {
        content: this.options.text,
        properties: {
            lineHeight: '48px'
        }
    }));

    @layout.fullSize()
    @layout.translate(0, 0, 60)
    overlay = new Surface({properties: {cursor: 'pointer'}});

    constructor(options = {}) {
        super(combineOptions({
            activeColor: Colors.PrimaryUIColor
        }, options));

        if (this.options.selected) {
            this.select();
        } else {
            this.deselect();
        }
    }

    getSize() {
        return [undefined, 64];
    }

    highlight() {
        this.circle.select();
        this.text.setProperties({color: this.options.activeColor});
    }

    unhighlight() {
        this.circle.deselect();
        this.text.setProperties({color: 'rgb(0, 0, 0)'});
    }

    select() {
        this.circle.select();
        this.text.setProperties({color: this.options.activeColor});
        this._isSelected = true;
    }

    deselect() {
        this.circle.deselect();
        this.text.setProperties({color: 'rgb(0, 0, 0)'});
        this._isSelected = false;
    }

    _handleTapStart() {
        this.highlight();
    }

    _handleTapEnd() {
        if (!this._isSelected) {
            this.unhighlight();
        }
    }

    _handleTapRemoved() {
        if (!this._isSelected) {
            this.unhighlight();
        }
    }

    getValue(){
        return this.text.getContent();
    }

}