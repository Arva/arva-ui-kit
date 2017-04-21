/**
 * Created by vlad on 27/01/2017.
 */

import {Text}               from 'arva-kit/text/Text.js';
import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

export class KeyValueElement extends View {

    @layout.dock.left(function () {
        return this.options.keyColumnWidth
    })
    @layout.size(function () {
        return this.options.keyColumnWidth
    }, ~14)
    key = new Text({
        content: this.options.key,
        properties: this.options.properties.key || {}
    });

    @layout.dock.left(function () {
        return this.options.valueColumnWidth
    })
    @layout.size(function () {
        return this.options.valueColumnWidth
    }, ~14)
    value = new Text({
        content: this.options.value,
        properties: this.options.properties.value || {}
    });

    constructor(options = {}) {
        super(combineOptions({
            properties: {
                key: {
                    overflowX:'hidden',
                    width:'100%'
                },
                value: {
                    overflowX:'hidden',
                    width:'100%'
                }
            }
        }, options));
    }

    setKey(key) {
        this.key.setContent(key);
    }

    setValue(value) {
        this.value.setContent(value);
    }

}