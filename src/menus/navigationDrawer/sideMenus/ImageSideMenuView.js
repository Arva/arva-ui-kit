/**
 * Created by Manuel on 28/07/16.
 */
import Surface                  from 'famous/core/Surface.js';
import BgImageSurface           from 'famous/surfaces/BgImageSurface.js';

import {layout}                 from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';

import {DraggableSideMenuView}  from './DraggableSideMenuView.js';
import {IconMenuItem}           from './IconMenuItem.js';


export class ImageSideMenuView extends DraggableSideMenuView {

    @layout.dock.top((width, height) => width/2, 12, 20)
    image = new BgImageSurface({
        content: this.options.image,
        sizeMode: BgImageSurface.SizeMode.ASPECTFILL
    });

    constructor(options = {}) {
        super(combineOptions({
            backgroundColor: 'white',
            itemClass: IconMenuItem
        },options));



    }
}   