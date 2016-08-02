/**
 * Created by Manuel on 28/07/16.
 */
import Surface                  from 'famous/core/Surface.js';

import {layout}                 from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {DraggableSideMenuView}  from './DraggableSideMenuView.js';

import {IconMenuItem}           from './IconMenuItem.js';

export class ImageSideMenuView extends DraggableSideMenuView {

    @layout.dock.top(function () {return this._halfWidth}, 12, 20)
    image = new Surface({
        properties: {
            'background-image': "url('https://firebasestorage.googleapis.com/v0/b/bizboard-chat.appspot.com/o/photo.jpg?alt=media&token=cefbe1a9-b0b5-4961-9b73-5ef7c60482a4')",
            'background-size': 'cover'
        }
    });

    constructor(options = {}) {
        super(combineOptions(options, {
            bgColor: 'rgba(255,255,255,1)',
            sideMenuRenderable: IconMenuItem,
            colors: {
                MenuBackgroundColor: 'white'
            }
        }));

        // workaround to determine half the width
        this.layout.on('layoutstart', ({size: [width]}) => {
            this._halfWidth = width / 2;
        });

        this.setItems([{
            text: 'Test1',
            controller: 'Home',
            method: 'Index'
        }, {
            text: 'Test2',
            controller: 'Home',
            method: 'Index'
        }, {
            text: 'Test3',
            controller: 'Home',
            method: 'Index'
        }]);

    }
}   