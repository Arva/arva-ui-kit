/**
 * Created by lundfall on 12/07/16.
 */

import {Surface}        from 'arva-js/surfaces/Surface.js';
import {combineOptions}             from 'arva-js/utils/CombineOptions.js';
import {layout, bindings, dynamic}  from 'arva-js/layout/Decorators.js';
import {Button}                     from './Button.js';
import {UIButtonPrimary}            from '../defaults/DefaultTypefaces.js';
import {Colors}                     from '../defaults/DefaultColors.js';
import {ComponentHeight}            from '../defaults/DefaultDimensions.js';

@dynamic(() =>
    bindings.setup({
        content: 'Press me',
        disabledOptions: {
            content: '',
            properties: {
                lineHeight: `${ComponentHeight}px`,
                color: Colors.White
            }
        },
        properties: {...UIButtonPrimary.properties, color: Colors.PrimaryUIColor}
    })
)
export class TextButton extends Button {
    @layout.translate(0, 0, 30)
    @layout.dock.top()
    @layout.size(true, undefined)
    @layout.origin(0.5, 0)
    @layout.align(0.5, 0)
        /* Options need to be spread here since databinding doesn't work when passing the whole options object */
    text = Surface.with(this.options.enabled ? {...this.options} : this.options.disabledOptions);

    @bindings.preprocess()
    generateBoxShadowVariations(){
        let {variation, disableBoxShadow} = this.options;
        Object.assign(this.options, TextButton.generateBoxShadowVariations(variation, disableBoxShadow));
    }

    @bindings.preprocess()
    mimicDisabledContent(){
        this.options.disabledOptions.content = this.options.content;
    }


    constructor(options = {}) {
        super( options );
        this.on('newSize', (size) => {
            this.options.properties.lineHeight = this.options.disabledOptions.properties.lineHeight = `${size[1]}px`;
        }, {propagate: false})
    }

    getSize() {
        let actualSize = super.getSize();
        return [actualSize[0], ComponentHeight];
    }

    setColor(color) {
        this.text.setProperties({color});
    }

    setContent(value) {
        this.text.setContent(value);
    }

    getContent(){
        return this.text.getContent();
    }

    _setEnabled(enabled, changeBackground = true) {
        this.options.enabled = enabled;
        let options = enabled ? this.options : this.options.disabledOptions;
        this.text.setProperties(options.properties);
        this.text.setContent(options.content);
    }

    static generateBoxShadowVariations(variation, disableBoxShadow) {
        return {
            useBoxShadow: (variation === 'noShadow' || disableBoxShadow) ? false : true,
            boxShadowType: variation
        }
    }
}