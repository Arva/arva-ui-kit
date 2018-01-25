/**

 * Created by joe on 2017-03-24.
 * */

import {Surface} from 'arva-js/surfaces/Surface.js';

import {View} from 'arva-js/core/View.js';
import {layout, bindings, event} from 'arva-js/layout/Decorators.js';
import {Colors} from '../../defaults/DefaultColors';

@bindings.setup({
    activeIndex: 0,
    numberOfItems: 1,
    dark: false
})
export class CarouselIndicators extends View {


    @layout.dock.left(24).size(8, 8).stick.center()
    dots = ({activeIndex, dark}) => Array(this.options.numberOfItems).fill().map((_, index) =>
        event.on('mousedown', () => this.options.activeIndex = index)(
            Surface.with({
                properties: {
                    backgroundColor: index === this.options.activeIndex ?
                        dark ? Colors.Black : Colors.White : dark ? Colors.Gray : Colors.LightGray,
                    cursor: 'pointer',
                    borderRadius: '50%'
                }
            })
        )
    )
}