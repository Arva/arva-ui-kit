/**
 * Created by vlad on 20/10/2016.
 */

import Surface                      from 'famous/core/Surface.js';

import {View}                       from 'arva-js/core/View.js';
import {layout, event}              from 'arva-js/layout/Decorators.js';
import {combineOptions}             from 'arva-js/utils/CombineOptions.js';
import {DataBoundScrollView}        from 'arva-js/components/DataBoundScrollView.js';
import {ListElement}                from './ListElement.js';
import {ListSpacing}                from '../defaults/DefaultDimensions.js';

@layout.columnDockPadding(720, [0, 0, 0, 0])
export class ListView extends View {
    _height = 0;

    @event.on('resize', function () {
        this._calculateSize();
    })
    @layout.dock.fill()
    @layout.translate(0, 0, 10)
    list = new DataBoundScrollView({
        ...this.options.dbsvOptions,
        dataStore: this.options.dataStore,
        itemTemplate: (listElement) => this.options.dataMapper
            ? new ListElement(this.options.dataMapper(listElement))
            : new ListElement({
                ...this.options.forAllElements,
                text: listElement[this.options.templateMap.text],
                previewText: listElement[this.options.templateMap.previewText],
                sideText: listElement[this.options.templateMap.sideText],
                statusColor: listElement[this.options.templateMap.statusColor],
                image: listElement[this.options.templateMap.image],
                bold: listElement[this.options.templateMap.bold] || this.options.bold,
                profileImage: this.options.profileImages,
                elementHeight: listElement[this.options.templateMap.elementHeight],
                backgroundColor: this._computeColor()

            }),
        layoutOptions: {
            spacing: this.options.spacing ? ListSpacing : 0
        }
    });

    /**
     * ListView that displays ListElements
     *
     * @example
     * listView = new ListView({
     *     profileImages: true,
     *     spacing: true,
     *     alternatingColors: true,
     *     forAllElements: {
     *         leftButtons: [
     *             {icon: TrashIcon, backgroundColor: 'rgb(255, 63, 63)'},
     *             {icon: CloudIcon, backgroundColor: 'rgb(0, 188, 235)'}
     *         ]
     *     }
     *     templateMap: {
     *         text: 'title',
     *         previewText: 'preview',
     *         sideText: 'date',
     *         statusColor: 'statusColor',
     *         image: 'image',
     *         bold: 'bold',
     *         elementHeight: 'height'
     *     }
     * });
     *
     * listView2 = new ListView({
     *     bold: true,
     *     profileImages: true,
     *     dataStore: window.listElements = this.dataStore = Injection.get(ListElements)
     *     dataMapper: (data) => ({
     *         text: data.title,
     *         previewText: data.previewText,
     *         sideText: data.date,
     *         statusColor: data.statusColor,
     *         image: data.image,
     *         icon: data.icon,
     *         leftButtons: [{
     *             icon: data.leftButton1Icon,
     *             backgroundColor: data.leftButton1Color,
     *         }],
     *         bold: data.bold
     *     }),
     * });
     *
     * @param {Object} options Construction options
     * @param {PrioritisedArray} [options.dataStore] PrioritisedArray to be used by the ListView DBSV
     * @param {Boolean} [options.bold] Make the main text of all the ListElements bold
     * @param {Boolean} [options.spacing] Adds a 1px spacing between ListElements with a 10% opacity
     *        in order for the background to be visible
     * @param {Boolean} [options.profileImages] Set all the ListElement images to profile images
     * @param {Boolean} [options.alternatingColors] Alternates the ListElements colors
     * @param {Object} [options.forAllElements] ListElement options which will be used for all elements in the list
     * @param {Object} [options.templateMap] Used to map ListElement options to models
     * @param {Object} [options.dataMapper] Used for customizing ListElement options
     *        while having individual ListElement data from the database available
     */
    constructor(options = {}) {
        super(combineOptions({
            templateMap: {},
            dbsvOptions: {},
            spacing: true
        }, options));


        if (this.options.spacing) {
            this.addRenderable(
                new Surface({properties: {backgroundColor: 'rgba(0, 0, 0, 0.1)'}}),
                'background',
                layout.dock.fill(),
                layout.size(undefined, function () {
                    return this._height > 0 ? this._height - ListSpacing : this._height;
                }),
                layout.translate(0, 0, -10)
            );
        }
    }

    _calculateSize() {
        this._height = this.list.getSize()[1];
        this.reflowRecursively();
    }

    _computeColor() {
        return this.options.alternatingColors && this.list.getDataSource().getLength() % 2 !== 0
                ? 'rgb(250, 250, 250)' : undefined;
    }

}