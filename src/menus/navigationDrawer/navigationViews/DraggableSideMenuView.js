/**
 * Created by manuel on 13-09-15.
 */

import Surface              from 'famous/core/Surface.js';
import TabBar               from 'famous-flex/widgets/TabBar.js';
import ScrollController     from 'famous-flex/ScrollController.js';
import ListLayout           from 'famous-flex/layouts/ListLayout.js';
import {View}               from 'arva-js/core/View.js';
import {layout, event}      from 'arva-js/layout/Decorators.js';
import {Dimensions}         from '../../../defaults/DefaultDimensions.js';
import {MenuItem}           from './MenuItem.js';

export class DraggableSideMenuView extends View {

    @layout.fullscreen
    background = new Surface({
        properties: {
            'background-color': (this.options.colors.MenuBackgroundColor)
        }
    });

    @layout.translate(0, 0, 20)
    @layout.fullscreen
    scrollController = new ScrollController({
        layout: ListLayout,
        dataSource: [
            this.navigationItems = new TabBar({
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
                        item.pipe(this.scrollController);
                        return item;
                    }
                }
            })
        ],
        autoPipeEvents: true,
        overscroll: false,
        scrollSync: {
            rails: true
        },
        touchMoveDirectionThreshold: 0.2
    });

    constructor(options = {}) {
        super(options);

        this.menuItems = options.menuItems;
        this.background.pipe(this._eventOutput);
        this.background.pipe(this.scrollController);
        
        /* TabBar returns size 0 for our true sized MenuItems, so we override its getSize() method to calc it ourselves. */
        this.navigationItems.getSize = () => {
            let totalHeight = _.reduce(this.navigationItems._renderables.items, (accumulator, item) => {
                accumulator += item.getSize()[1] || 0;
                return accumulator;
            }, 0);
            return [undefined, totalHeight || true];
        };

        this.navigationItems.on('tabchange', ({item, oldItem}) => {
            oldItem.setSelected(false);
            item.setSelected(true);
        });

        this.navigationItems.setItems(options.menuItems);
    }

    /**
     * Set the items in the scrollView
     * @param items
     */
    setItems(items) {
        this.options.menuItems = items;
        this.navigationItems.setItems(items);
        this.menuItems = items;
    }

    setItem(item) {
        let items = this.navigationItems.getItems();
        items.push(item);
        this.setItems(items);
    }

    getSize() {
        return [undefined, this.navigationItems.getItems().reduce(((total, {getSize, size}) => total + 0 + (size ? size[1] : getSize()[1] )), 0)
        + 2 * this.options.sideMenuOptions.itemMargin || Dimensions.sideMenuOptions.itemMargin + Dimensions.topBarHeight];
    }
}