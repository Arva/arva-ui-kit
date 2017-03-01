/**
 * Created by tom on 08/02/2017.
 */

import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import {Checkbox}           from './Checkbox.js';
import {UIRegular}          from '../text/UIRegular.js';
import {UISmallGray}        from '../text/UISmallGray.js';
import {ComponentHeight}    from '../defaults/DefaultDimensions.js';

export class LabeledCheckbox extends View {

    @layout.dock.left(ComponentHeight, 0, 20)
    checkbox = new Checkbox(this.options.checkbox);

    @layout.stick.left()
    @layout.size(~100, ~36)
    @layout.dock.left(~100, 16, 20)
    labels = new Labels(this.options);

    constructor(options = {}) {
        super(combineOptions({
            checkbox: {
                shadowType: 'softShadow',
                enabled: true,
                state: true
            },
            label: {
                properties: {
                    whiteSpace: 'nowrap'
                }
            }
        }, options));
    }

    setLabels(label, subLabel) {
        return this.labels.setLabels(label, subLabel);
    }

    isChecked() {
        return this.checkbox.isChecked();
    }
}

class Labels extends View {

    @layout.dock.top(~20)
    @layout.size(~100, ~20)
    label = new UIRegular(this.options.label);

    @layout.size(~100, ~14)
    @layout.dock.top(~14, 2)
    subLabel = this.options.subLabel ? new UISmallGray(this.options.subLabel) : undefined;

    constructor(options) {
        super(options);

        if(!this.options.subLabel) {
            this.decorateRenderable('label', layout.stick.left(), layout.dock.top(ComponentHeight))
        }
    }

    setLabels(label, subLabel) {
        if(label && this.label) {
            this.label.setContent(label);
        }

        if(subLabel && this.subLabel) {
            this.subLabel.setContent(subLabel);
        }
    }
}