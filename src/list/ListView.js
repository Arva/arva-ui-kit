/**
 * Created by vlad on 20/10/2016.
 */

import Surface                      from 'famous/core/Surface.js';

import {View}                       from 'arva-js/core/View.js';
import {Injection}                  from 'arva-js/utils/Injection.js';
import {layout}                     from 'arva-js/layout/Decorators.js';
import {combineOptions}             from 'arva-js/utils/CombineOptions.js';
import {DataBoundScrollView}        from 'arva-js/components/DataBoundScrollView.js';
import {ListElement}                from './ListElement.js';
import {ListElements}               from './ListElements.js';

@layout.columnDockPadding(720, [0])
export class ListView extends View {

    _height = 0;

    @layout.dock.fill()
    @layout.size(undefined, function (_, parentHeight) {
        return Math.min(this._height, parentHeight);
    })
    background = new Surface({properties: {backgroundColor: 'rgba(0, 0, 0, 0.1)'}});

    @layout.dock.fill()
    list = new DataBoundScrollView({
        dataStore: window.listElements = this.dataStore = Injection.get(ListElements),
        itemTemplate: (listElement) => new ListElement({
            text: listElement[this.options.dataMapping.text],
            previewText: listElement[this.options.dataMapping.previewText],
            sideText: listElement[this.options.dataMapping.sideText],
            statusColor: listElement[this.options.dataMapping.statusColor],
            image: listElement[this.options.dataMapping.image],
            icon: listElement[this.options.dataMapping.icon],
            leftButtons: [{
                icon: listElement.leftButtons.icon,
                backgroundColor: listElement.leftButtons.color
            }, {
                icon: listElement.leftButtons.icon,
                backgroundColor: listElement.leftButtons.color
            }],
            rightButtons: [{
                icon: listElement.rightButtons.icon,
                backgroundColor: listElement.rightButtons.color
            }, {
                icon: listElement.rightButtons.icon,
                backgroundColor: listElement.rightButtons.color
            }],
            testProp: listElement.leftButtons
        }),
        layoutOptions: {
            spacing: this.options.spacing ? 1 : 0
        }
    });

    _calcSize() {
        this._height = this.dataStore.length * 64;
    }

    constructor(options = {}) {
        super(combineOptions({
            dataMapping: {
                text: 'title',
                previewText: 'preview',
                sideText: 'date',
                statusColor: 'statusColor',
                image: 'image',
                icon: 'icon'
            },
            spacing: true
        }, options));
        this.dataStore.on('child_added', this._calcSize);
        this.dataStore.on('child_changed', this._calcSize);
        this.dataStore.on('child_removed', this._calcSize);
    }

}