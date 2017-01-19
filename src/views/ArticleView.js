/**
 * Created by lundfall on 21/10/2016.
 */

import Surface              from 'famous/core/Surface.js';
import ImageSurface         from 'famous/surfaces/ImageSurface.js';
import BkImageSurface       from 'famous-bkimagesurface';

import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import {Colors}             from '../defaults/DefaultColors.js';
import {TextInfoLabel}      from '../text/TextInfoLabel.js';
import {Text}               from '../text/Text.js';
import {TextH1}             from '../text/TextH1.js';
import {TextH2}             from '../text/TextH2.js';
import {TextH3}             from '../text/TextH3.js';
import {TextCaption}        from '../text/TextCaption.js';

@layout.scrollable()
@layout.dockSpace(32)
@layout.columnDockPadding(720, [16, 32])
export class ArticleView extends View {

    @layout.translate(0, 0, -10)
    @layout.fullSize()
    background = new Surface({properties: {backgroundColor: Colors.LightGray}});

    constructor(options = {}) {
        super(combineOptions({
            items: []
        }, options));

        let previousItem;
        for(let [index, item] of this.options.items.entries()){
            let decorators = [layout.dock.top(~30)];
            if(item instanceof TextInfoLabel &&
                (
                    previousItem instanceof TextH1 ||
                    previousItem instanceof TextH2 ||
                    previousItem instanceof TextH3
                )){
                decorators.push(layout.dockSpace(4));
                /*  Or, if it's below a text caption underneath an image */
            } else if (item instanceof TextCaption &&
                (previousItem instanceof ImageSurface || previousItem instanceof BkImageSurface)) {
                decorators.push(layout.dockSpace(4));
            } else if (previousItem instanceof TextH3 && item instanceof Text){
                decorators.push(layout.dockSpace(0));
            }

            if(item instanceof TextCaption){
                item.setProperties({textAlign: 'center'});
            }

            this.addRenderable(item, `item${index}`, ...decorators);
            /* Else, use globally defined dockSpace */

            previousItem = item;
        }

    }
}