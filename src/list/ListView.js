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
        itemTemplate: async (childData) => {
            if (this.options.dataMapper) {
                let listOptions = this.options.dataMapper(childData);
                if (listOptions instanceof Promise) {
                    listOptions = await listOptions;
                }
                return new ListElement({...this.options.forAllElements, ...listOptions});
            } else {
                return  new ListElement({
                    ...this.options.forAllElements,
                    text: childData[this.options.templateMap.text],
                    previewText: childData[this.options.templateMap.previewText],
                    sideText: childData[this.options.templateMap.sideText],
                    statusColor: childData[this.options.templateMap.statusColor],
                    image: childData[this.options.templateMap.image],
                    icon: childData[this.options.templateMap.icon],
                    bold: childData[this.options.templateMap.bold] || this.options.bold,
                    profileImage: this.options.profileImages,
                    elementHeight: childData[this.options.templateMap.elementHeight],
                    backgroundColor: this._computeColor()
                });
            }
        },
        layoutOptions: {
            spacing: this.options.spacing
        }
    });

    /**
     * ListView that displays ListElements
     *
     * @example
     *
     * // Offline
     * listView = new ListView({
     *     profileImages: true,
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
     * // Online
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
     * @param {Boolean} [options.spacing] Spacing between the list items
     * @param {Boolean} [options.profileImages] Set all the ListElement images to profile images
     * @param {Boolean} [options.alternatingColors] Alternates the ListElements colors
     * @param {Object} [options.forAllElements] ListElement options which will be used for all elements in the list
     * @param {Object} [options.templateMap] Used to map ListElement options to model properties
     * @param {Object} [options.dataMapper] Used for customizing ListElement options
     *        while having individual ListElement data from the database available
     */
    constructor(options = {}) {
        super(combineOptions({
            templateMap: {},
            dbsvOptions: {},
            spacing: ListSpacing
        }, options));


        if (this.options.spacing) {
            this.addRenderable(
                new Surface({properties: {backgroundColor: 'rgba(0, 0, 0, 0.1)'}}),
                'background',
                layout.dock.fill(),
                event.pipe('list'),
                layout.size(undefined, function () {
                    return this._height > 0 ? this._height - this.options.spacing : this._height;
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