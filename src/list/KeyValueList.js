/**
 * Created by vlad on 27/01/2017.
 */

import {KeyValueElement}            from 'arva-kit/list/KeyValueElement.js';
import {View}                       from 'arva-js/core/View.js';
import {layout}                     from 'arva-js/layout/Decorators.js';
import {combineOptions}             from 'arva-js/utils/CombineOptions.js';
import {UISmallGray,UISmall}         from 'arva-kit/defaults/DefaultTypefaces.js';

export class KeyValueList extends View {

    /**
     * A list of key value text elements
     *
     * @example
     * keyValueList = new KeyValueList({
     *     list: [
     *         {key: 'Monday', value: '11:00 - 17:00'},
     *         {key: 'Tuesday', value: '09:00 - 17:00'},
     *         {key: 'Wednesday', value: '10:00 - 13:00'},
     *         {key: 'Thursday', value: '09:00 - 21:00', properties: {color: 'rgb(255, 140, 42)'}},
     *         {key: 'Friday', value: '09:00 - 17:00'},
     *         {key: 'Saturday', value: '09:00 - 13:00'},
     *         {key: 'Sunday', value: 'Closed'},
     *     ],
     *     textProperties: {
     *         key: UISmallGray,
     *         value: UISmall
     *     },
     *     keyColumnWidth: 100,
     *     spacing: 16
     * });
     *
     * @param {Object} options Construction options
     * @param {Array} [options.list] A list of objects containing each row's key and value. Each one of these object
     *        can also contain properties to be applied on that specific element's value text.
     * @param {Object} [options.textProperties] Contains the global custom key and value text properties.
     * @param {String} [options.keyColumnWidth] Sets the width of the key column
     * @param {Number} [options.spacing] Sets a custom spacing between elements
     */
    constructor(options = {}) {
        super(combineOptions({
            list: [],
            textProperties: {
                key: UISmallGray,
                value: UISmall
            },
            spacing: 16,
            keyColumnWidth: 100,
            valueColumnWidth: ~100,
            layout:{
                stick:layout.stick.left
            }
        }, options));

        let list = this.options.list;
        for (let i = 0; i < list.length; i++) {
            let element = list[i];
            this.addRenderable(
                new KeyValueElement({
                    key: element.key,
                    value: element.value,
                    properties: combineOptions(this.options.textProperties, {value: element.properties}),
                    keyColumnWidth: this.options.keyColumnWidth,
                    valueColumnWidth: this.options.valueColumnWidth
                }), `element ${i}`,
                layout.dock.top(~20, this.options.spacing), this.options.layout.stick()
            );
        }
    }

    setList(list) {
        for (let i = 0; i < list.length; i++) {
            let element = list[i];
            this.addRenderable(
                new KeyValueElement({
                    key: element.key,
                    value: element.value,
                    properties: combineOptions(this.options.textProperties, {value: element.properties}),
                    keyColumnWidth: this.options.keyColumnWidth,
                    valueColumnWidth: this.options.valueColumnWidth
                }), `element ${i}`,
                layout.dock.top(~20, this.options.spacing), this.options.layout.stick()
            );
        }
    }

    setKeyValue(elementIndex, key, value) {
        this.setKey(elementIndex, key);
        this.setValue(elementIndex, value);
    }

    setKey(elementIndex, key) {
        let element = this[`element ${elementIndex}`];
        if (element) {
            element.setKey(key);
        }
    }

    setValue(elementIndex, value) {
        let element = this[`element ${elementIndex}`];
        if (element) {
            element.setValue(value);
        }
    }
}