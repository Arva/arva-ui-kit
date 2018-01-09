/**
 * Created by tom on 08/02/2017.
 */

import {View}                                   from 'arva-js/core/View.js';
import {layout, bindings}                       from 'arva-js/layout/Decorators.js';
import {combineOptions}                         from 'arva-js/utils/CombineOptions.js';
import {Checkbox}                               from './Checkbox.js';
import {UIRegular}                              from '../text/UIRegular.js';
import {UISmallGray}                            from '../text/UISmallGray.js';
import {ComponentHeight, ComponentPadding}      from '../defaults/DefaultDimensions.js';

const ComponentSpacing = 20;

@bindings.setup({
    checkbox: {
        shadowType: 'softShadow',
        enabled: true,
        state: true
    },
    label: {
        properties: {
            whiteSpace: 'nowrap',
            width:'100%',
            overflowX: 'hidden',
            textOverflow:'ellipsis'
        }
    },
    center: true
})
export class LabeledCheckbox extends View {

    @layout.dock.left(ComponentHeight, 0, ComponentSpacing)
    checkbox = new Checkbox(this.options.checkbox);

    @layout.stick.center()
    @layout.size((width) => (width - (ComponentHeight + ComponentSpacing + ComponentPadding)), ~8)
    @layout.translate((ComponentHeight - ComponentPadding), 0, 20)
    labels = new Labels(this.options);


    setLabels(label, subLabel) {
        return this.labels.setLabels(label, subLabel);
    }

    isChecked() {
        return this.checkbox.isChecked();
    }

    unCheck() {
        this.checkbox.unCheck()

    }

    check() {
        this.checkbox.check()
    }

    getSize() {
        return [undefined, this.checkbox.getSize()[1]]
    }
}

class Labels extends View {

    @layout.dock.top(~1)
    label = new UIRegular(this.options.label);

    @layout.dock.top(~1, 2)
    subLabel = this.options.subLabel ? new UISmallGray(this.options.subLabel) : undefined;

    constructor(options) {
        super(options);

        if (!this.options.subLabel && !this.options.center) {
            this.decorateRenderable(this.label, layout.stick.left(), layout.dock.top(ComponentHeight));
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