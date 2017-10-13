/**
 * Created by tom on 06/09/16.
 */

import Surface                      from 'arva-js/famous/core/Surface.js';

import {View}                       from 'arva-js/core/View.js';
import {layout}                     from 'arva-js/layout/Decorators.js';
import {DataBoundScrollView}        from 'arva-js/components/DataBoundScrollView.js';

import {LoadingSpinnerSquares}      from '../../loaders/LoadingSpinnerSquares.js';
import {SectionHeader}              from '../../components/SectionHeader.js';
import {Item}                       from './Item.js';
import {Dimensions}                 from '../../defaults/DefaultDimensions.js';


let {searchField: {borderRadius}} = Dimensions;

@layout.dockPadding(32, 0, 0, 0)
export class ResultsView extends View {

    @layout.fullSize()
    border = new Surface(
        { properties: {
            backgroundColor: 'rgb(255, 255, 255)',
            boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.12)',
            borderRadius: borderRadius
        }}
    );

    @layout.animate({showInitially: false})
    @layout.dock.fill()
    @layout.translate(0, 0, 30)
    content = new DataBoundScrollView({
        useContainer: true,
        placeholderTemplate: () => new LoadingSpinnerSquares({loaderSize: [this.options.itemHeight, this.options.itemHeight]}),
        itemTemplate: (model) => {
            let item = new Item({ size: [undefined, this.options.itemHeight], content: model.content || '' });
            /* Need to listen to mousedown and touchstart, not click, because they trigger the focus lost that implodes the
            *  ResultsView from SearchBar */
            item.on('mousedown', () => {
                this._eventOutput.emit('resultChosen', model);
            });
            item.on('touchstart', () => {
                this._eventOutput.emit('resultChosen', model);
            });
            return item;
        },
        groupTemplate: (content) => new SectionHeader({ content, textAlign: 'center' }),
        ...this.options.resultOptions
    });

    /**
     * Used in SearchField, not meant to be ran individually.
     *
     * @param {Object} [options] Construction options
     */
    constructor(options = {}) {
        super({
            itemHeight: 48,
            showContent: true,
            groupHeight: 32,
            maxHeight: 300,
            ...options /* Can't use combineOptions() because options.resultOptions.dataStore is a PrioArray. */
        });

        if(this.options.showContent){
            this.showRenderable(this.content);
        }



        this.content.on('resize', this.reflowRecursively);
    }

    getSize() {
        /* If no elements are present, the placeholder will be shown */
        let amountOfItems = (this.content.getDataStore() || []).length;
        let itemHeight = amountOfItems * this.options.itemHeight;

        let placeholderHeight = 48 + 2 * 16;

        let amountOfGroups = Object.keys(this.content.getGroups() || {}).length;
        let groupHeight = amountOfGroups * this.options.groupHeight;

        return [undefined, Math.min(((itemHeight + groupHeight) || placeholderHeight) + 32, this.options.maxHeight)];
    }
}    