/**
 * Created by tom on 08/02/2017.
 */

import {View}                                   from 'arva-js/core/View.js';
import {layout, bindings, dynamic}              from 'arva-js/layout/Decorators.js';
import {Checkbox}                               from './Checkbox.js';
import {UIRegular}                              from '../text/UIRegular.js';
import {UISmallGray}                            from '../text/UISmallGray.js';
import {Dimensions}      from '../defaults/DefaultDimensions.js';

const ComponentSpacing = 20;

@bindings.setup({
    checkbox: {
        shadowType: 'softShadow',
    },
    center: true
})
export class LabeledCheckbox extends View {

    @layout.dock.left(Dimensions.ComponentHeight, 0, ComponentSpacing)
    checkbox = Checkbox.with(this.options);

    @layout.stick.center()
    @layout.size((width) => (width - (Dimensions.ComponentHeight + ComponentSpacing + Dimensions.ComponentPadding)), ~8)
    @layout.translate((Dimensions.ComponentHeight - Dimensions.ComponentPadding), 0, 20)
    labels = Labels.with(this.options);


    getSize() {
        return [undefined, this.checkbox.getSize()[1]]
    }
}

@bindings.setup({
    label: '',
    subLabel: ''
})
class Labels extends View {

    @layout.dock.top(~1)
    label = UIRegular.with({content: this.options.label});

    @dynamic(({subLabel, center}) => !subLabel && !center && layout.stick.left().dock.top(Dimensions.ComponentHeight))
    @layout.dock.top(~1, 2)
    subLabel = this.options.subLabel && UISmallGray.with({content: this.options.subLabel});

}