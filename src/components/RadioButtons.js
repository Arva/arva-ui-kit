/**
 * Created by vlad on 19/09/16.
 */

import Surface                          from 'famous/core/Surface.js';
import {layout, event}                  from 'arva-js/layout/Decorators.js';
import {combineOptions}                 from 'arva-js/utils/CombineOptions.js';
import {Clickable}                      from './Clickable.js';
import {RadioButton}                    from './RadioButton.js';
import {Colors}                         from '../defaults/DefaultColors.js';

export class RadioButtons extends Clickable {

    constructor(options = {}) {
        super(combineOptions({
            activeColor: Colors.PrimaryUIColor
        }, options));

        this.radioButtons = [];
        let {buttons} = this.options;
        this.selectedIndex = -1;

        for (let [i, settings] of buttons.entries()) {
            this.selectedIndex = this.selectedIndex === -1 && settings.selected ? i : this.selectedIndex;

            this.addRenderable(new RadioButton({
                    icon: settings.icon,
                    text: settings.text,
                    selected: settings.selected
                }), 'radioButton' + i,
                layout.dock.top(),
                layout.size(undefined, 64),
                layout.translate(0, 0, 10),
                event.on('click', function () {
                    this._updateSelectedButton(i);
                })
            );
        }

        this.addRenderable(new Surface({
                properties: {
                    backgroundColor: this.options.activeColor
                }
            }), 'line',
            layout.size(2, (width, height) => height - 64),
            layout.origin(0.5, 0.5),
            layout.align(0, 0.5),
            layout.translate(24, 0, 0)
        );
    }

    _updateSelectedButton(newSelectedIndex) {
        if (this.selectedIndex !== newSelectedIndex) {
            this['radioButton' + newSelectedIndex].select();
            this['radioButton' + this.selectedIndex].deselect();
            this.selectedIndex = newSelectedIndex;
        }
    }

}