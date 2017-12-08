/**
 * Created by manuel on 13-09-15.
 */
import reduce               from 'lodash/reduce.js';

import Surface              from 'famous/core/Surface.js';
import TabBar               from 'famous-flex/widgets/TabBar.js';
import ScrollController     from 'famous-flex/ScrollController.js';
import ListLayout           from 'famous-flex/layouts/ListLayout.js';

import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import {Colors}             from '../../../defaults/DefaultColors.js';
import {MenuItem}           from './MenuItem.js';

export class DraggableSideMenuView extends View {

    @layout.fullSize()
    background = new Surface({
        properties: {
            backgroundColor: this.options.backgroundColor
        }
    });

    /* Dock fill as DraggableSideMenuView can be extended with extra dockable renderables */
    @layout.dock.fill()
    @layout.translate(0, 0, 20)
    scrollController = new ScrollController({
        layout: ListLayout,
        dataSource: [
            this.navigationItems = new TabBar({
                layoutController: {
                    direction: this.options.direction
                },
                tabBarLayout: {
                    margins: [this.options.itemMargin, 0],
                    spacing: 0,
                    itemSize: true
                },
                createRenderables: {
                    background: false,
                    selectedItemOverlay: ()=> {
                        return new Surface({
                            size: [undefined, this.options.itemHeight]
                        });
                    },
                    item: (id, options) => {
                        /* Shallow-merge the options for the menuItem that came from the parent draggableSideMenu */
                        let item = new this.options.itemClass({
                            ...this.options.menuItem, ...options
                        });
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
        super(combineOptions({
            itemClass: MenuItem,
            backgroundColor: Colors.PrimaryUIColor,
            viewClass: DraggableSideMenuView
        },options));

        this.menuItems = options.menuItems;
        this.background.pipe(this._eventOutput);
        this.background.pipe(this.scrollController);

        /* TabBar returns size 0 for our true sized MenuItems, so we override its getSize() method to calc it ourselves. */
        this.navigationItems.getSize = () => {
            let totalHeight = reduce(this.navigationItems._renderables.items, (accumulator, item) => {
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
        return [undefined, this.navigationItems.getItems().reduce(((total, item) => total + 0 + (item.size ? item.size[1] : item.getSize()[1] )), 0)
        + 2 * this.options.itemMargin ];
    }
}