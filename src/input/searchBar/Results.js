/**
 * Created by tom on 06/09/16.
 */

import Surface                  from 'famous/core/Surface.js';

import {View}                   from 'arva-js/core/View.js';
import {layout}                 from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {DataBoundScrollView}    from 'arva-js/components/DataBoundScrollView.js';

import {BORDER_RADIUS}          from '../SearchBar.js';

@layout.dockPadding(32, 0, 0, 0)
export class Results extends View {

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
        // container: { properties: { backgroundColor: 'rgba(255, 0, 0, 0.4)', overflow: 'hidden' } },
        itemTemplate: () => new Surface({ size: [undefined, 48], content: 'item' }),
        groupTemplate: () => new Surface({ size: [undefined, 32], content: 'group' }),
        ...this.options.resultOptions
    });

    constructor(options = {}) {
        super(options);
    }

    getSize() {
        let height = this.options.resultOptions.dataStore.length * 48;
        return [undefined, height + 32];
    }
}    