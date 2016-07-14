/**
 * Created by manuel on 13-09-15.
 */

import Surface              from 'famous/core/Surface.js';
import {View}               from 'arva-js/core/View.js';
import TabBar               from 'famous-flex/widgets/TabBar.js';
import {Dimensions}         from '../../../defaults/DefaultDimensions.js';
import {MenuItem}           from './MenuItem.js';

export class DraggableSideMenuView extends View {
    constructor(options = {}) {
        super(options);

        this.menuItems = options.menuItems;

        this.renderables.background = new Surface({
            properties: {
                'background-color': (options.colors.MenuBackgroundColor)
            }
        });

        this.renderables.navigationItems = new TabBar({
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
                            backgroundColor: options.colors.MenuBackgroundHighLightColor
                        }
                    });
                },
                item: (id, data)=> {
                    let item = this.options.sideMenuRenderable ? new this.options.sideMenuRenderable(options, data) : new MenuItem(options, data);
                    item.pipe(this._eventOutput);
                    return item;
                }
            }
        });
        this.renderables.background.pipe(this._eventOutput);

        this.renderables.navigationItems.on('tabchange', ({item,oldItem}) => {
            oldItem.setSelected(false);
            item.setSelected(true);
        });

        this.renderables.navigationItems.setItems(options.menuItems);

        this.layouts.push((context) => {
            context.set('background', {
                size: [context.size[0], Math.max(window.innerHeight, this.getSize()[1])],
                origin: [0, 0],
                align: [0, 0],
                translate: [0, -Dimensions.topBarHeight, 10]
            });

            context.set('navigationItems', {
                size: [context.size[0], this.options.showTopMenu ? context.size[1] - options.topBarHeight : context.size[1]],
                origin: [0, 0],
                align: [0, 0],
                translate: [0, 0, 20]
            });
        });
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