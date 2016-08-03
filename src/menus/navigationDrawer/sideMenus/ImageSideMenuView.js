/**
 * Created by Manuel on 28/07/16.
 */
import Surface                  from 'famous/core/Surface.js';

import {layout}                 from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {AccountIcon}            from 'arva-kit/icons/AccountIcon.js';
import {CloudIcon}              from 'arva-kit/icons/CloudIcon.js';
import {ArrowleftIcon}          from 'arva-kit/icons/ArrowleftIcon.js';
import {AndroidshareIcon}       from 'arva-kit/icons/AndroidshareIcon.js';

import {DraggableSideMenuView}  from './DraggableSideMenuView.js';
import {IconMenuItem}           from './IconMenuItem.js';

export class ImageSideMenuView extends DraggableSideMenuView {

    @layout.dock.top((width, height) => width/2, 12, 20)
    image = new Surface({
        properties: {
            'background-image': "url('http://www.jcraft.nl/wp-content/uploads/2016/03/High-tech-plaatje-gallery.jpg')",
            'background-size': 'cover'
        }
    });

    constructor(options = {}) {
        super(combineOptions({
            backgroundColor: 'white',
            itemClass: IconMenuItem
        },options));



    }
}   