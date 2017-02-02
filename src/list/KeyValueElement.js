/**
 * Created by vlad on 27/01/2017.
 */

import {Text}               from 'arva-kit/text/Text.js';
import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

export class KeyValueElement extends View {

    @layout.dock.left()
    @layout.stick.center()
    @layout.size(function () {
        return this.options.keyColumnWidth
    }, ~14)
    key = new Text({
        content: this.options.key,
        properties: (this.options.properties.key || {}).properties
    });

    @layout.dock.left()
    @layout.stick.left()
    @layout.size(~100, ~14)
    value = new Text({
        content: this.options.value,
        properties: (this.options.properties.value || {}).properties
    });

    constructor(options = {}) {
        super(combineOptions({
            properties: {}
        }, options));
    }

    setKey(key) {
        this.key.setContent(key);
    }

    setValue(value) {
        this.value.setContent(value);
    }

}