/**
 * Created by tom on 06/09/16.
 */

import Surface                  from 'famous/core/Surface.js';

import {View}                   from 'arva-js/core/View.js';
import {layout}                 from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {DataBoundScrollView}    from 'arva-js/components/DataBoundScrollView.js';

import {BORDER_RADIUS}          from '../SearchBar.js';
import {SquaresLoader}          from '../../loaders/SquaresLoader.js';
import {SectionHeader}          from '../../components/SectionHeader.js';
import {Item}                   from './Item.js';

@layout.dockPadding(32, 0, 0, 0)
export class ResultsView extends View {

    @layout.fullSize()
    border = new Surface(
        { properties: {
            backgroundColor: 'rgb(255, 255, 255)',
            boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.12)',
            borderRadius: BORDER_RADIUS
        }}
    );

    @layout.translate(0, 0, 10)
    @layout.dock.fill()
    content = new DataBoundScrollView({
        useContainer: true,
        placeholderTemplate: () => new SquaresLoader({ loaderSize: [this.options.itemHeight, this.options.itemHeight] }),
        itemTemplate: (model) => new Item({ size: [undefined, this.options.itemHeight], content: model.content || '' }),
        groupTemplate: (content) => new SectionHeader({ content, textAlign: 'center' }),
        ...this.options.resultOptions
    });

    constructor(options = {}) {
        super({
            itemHeight: 48,
            groupHeight: 32,
            ...options /* Can't use combineOptions() because options.resultOptions.dataStore is a PrioArray. */
        });
    }

    getSize() {
        /* If no elements are present, the placeholder will be shown */
        let amountOfItems = (this.content.getDataStore() || []).length;
        let itemHeight = amountOfItems * this.options.itemHeight;

        let placeholderHeight = 48 + 2 * 16;

        let amountOfGroups = Object.keys(this.content.getGroups() || {}).length;
        let groupHeight = amountOfGroups * this.options.groupHeight;

        return [undefined, ((itemHeight + groupHeight) || placeholderHeight) + 32];
    }
}    