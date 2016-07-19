/**
 * Created by manuel on 13-09-15.
 */

import Surface              from 'famous/core/Surface.js';
import TabBar               from 'famous-flex/widgets/TabBar.js';
import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/decorators.js';
import {Dimensions}         from '../../../defaults/DefaultDimensions.js';
import {MenuItem}           from './MenuItem.js';

export class DraggableSideMenuView extends View {

    @layout.size((size)=>size, window.innerHeight)
    background = new Surface({
        properties: {
            'background-color': (this.options.colors.MenuBackgroundColor)
        }
    });

    @layout.translate(0,0,20)
    @layout.dock('fill')
    navigationItems = new TabBar({
        layoutController: {
            direction: this.options.sideMenuOptions.direction || Dimensions.sideMenuOptions.direction
        },
        tabBarLayout: {
            margins: [this.options.sideMenuOptions.itemMargin || Dimensions.sideMenuOptions.itemMargin, 0],
            spacing: 0,
            itemSize: true
        },
        createRenderables: {
            background: false,
            selectedItemOverlay: ()=>{
                return new Surface({
                    size: [undefined, this.options.sideMenuOptions.itemHeight || Dimensions.sideMenuOptions.itemHeight],
                    properties: {
                        backgroundColor: this.options.colors.MenuBackgroundHighLightColor
                    }
                });
            },
            item: (id, data)=> {
                let item = this.options.sideMenuRenderable ? new this.options.sideMenuRenderable(this.options, data) : new MenuItem(this.options, data);
                item.pipe(this._eventOutput);
                return item;
            }
        }
    });

    constructor(options = {}) {
        super(options);

        this.menuItems = options.menuItems;

        this.renderables.background = this.background;

        this.renderables.navigationItems = this.navigationItems;
        this.renderables.background.pipe(this._eventOutput);

        this.renderables.navigationItems.on('tabchange', ({item,oldItem}) => {
            oldItem.setSelected(false);
            item.setSelected(true);
        });

        this.renderables.navigationItems.setItems(options.menuItems);

    }

    /**
     * Set the items in the scrollView
     * @param items
     */
    setItems(items) {
        this.options.menuItems = items;
        this.renderables.navigationItems.setItems(items);
        this.menuItems = items;
    }

    setItem(item){
        let items = this.renderables.navigationItems.getItems();
        items.push(item);
        this.setItems(items);
    }

    getSize() {
        return [undefined, this.renderables.navigationItems.getItems().reduce(((total, {getSize, size}) => total + 0 + (size ? size[1] : getSize()[1] )), 0) + 2 * this.options.sideMenuOptions.itemMargin || Dimensions.sideMenuOptions.itemMargin + Dimensions.topBarHeight];
    }
}