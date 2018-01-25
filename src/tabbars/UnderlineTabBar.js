
import Surface              from 'famous/core/Surface.js';

import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import {LineTabBar}         from './LineTabBar.js';

import {UIBar}              from '../uibars/UIBar.js';


/**
 *
 * Wrapper for the tab bar that allows it to be used outside of the UIBar,
 * and places a faint (10% opacity) line beneath
 *
 *
 * @param {Renderable} [options.tabBar] - type of tab bar
 * @param {Object} [options.tabBarOptions] - standard options object for the tabbar
 * @param {Array} [options.tabBarContent] - standard content array for the tabbar
 * @param {String} [options.underlineColor] - color for underline bar
 *
 */

//TODO This class is very hacky - It should not create a UI bar to rely on functionality
export class UnderlineTabBar extends View {

    @layout.dock.bottom(1)
    underline = new Surface({
        properties: {
            backgroundColor: this.options.underlineColor
        }
    });

    constructor(options={}){
        super(combineOptions({
            underlineColor: 'rgba(0,0,0,0.1)',
            tabBarWidth: 0.5,
            tabBar: LineTabBar,
            tabBarPosition: 'center'
        }, options));

        this._addTabBar()
    }

    _addTabBar(){
        let decorators = [
            layout.dock.bottom(48),
            layout.stick[this.options.tabBarPosition](),
            layout.size(this.options.tabBarWidth, 48)
        ];

        this.options.tabBarTranslate && decorators.push(layout.translate.apply(layout, this.options.tabBarTranslate));

        let uibar = new UIBar({
            bottomLine: false,
            components: [
                [new this.options.tabBar(this.options.tabBarOptions, this.options.tabBarContent), 'tabBar', 'fill']
            ]
        });

        this.addRenderable(uibar, 'uiBar', ...decorators);

    }
}