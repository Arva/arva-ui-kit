/**
 * Created by lundfall on 12/07/16.
 */

import {Surface} from 'arva-js/surfaces/Surface.js';
import {combineOptions} from 'arva-js/utils/CombineOptions.js';
import {layout, bindings, dynamic} from 'arva-js/layout/Decorators.js';
import {Button} from './Button.js';
import {UIButtonPrimary, UIRegular} from '../defaults/DefaultTypefaces.js';
import {Colors} from '../defaults/DefaultColors.js';
import {ComponentHeight} from '../defaults/DefaultDimensions.js';

@dynamic(() =>
    bindings.setup({
        content: 'Press me',
        disabledOptions: {
            content: '',
            properties: {
                ...UIButtonPrimary.properties,
                color: Colors.Gray,
            }
        },
        center: true,
        bold: true,
        properties: {...UIButtonPrimary.properties, color: Colors.PrimaryUIColor}
    })
)
export class WhiteTextButton extends Button {

    @bindings.trigger()
    changeAccordingToBoldNess(options){
        if(options.bold){
            options.properties = {...UIButtonPrimary.properties, color: Colors.PrimaryUIColor}
        } else {
            options.properties = {...UIRegular.properties, color: Colors.PrimaryUIColor}
        }
    }

    @dynamic(({center}) =>
        center ? layout.size(true, undefined).columnDockPadding(Infinity, [0]) :
            layout.size(undefined, undefined).columnDockPadding(320, [0, 32])
    )
    @layout.translate(0, 0, 30)
        .dock.top()
        .stick.center()
        /* Options need to be spread here since databinding doesn't work when passing the whole options object */
    text = Surface.with(this.options.enabled ? {...this.options} : this.options.disabledOptions);

    @bindings.trigger()
    generateBoxShadowVariations() {
        let {variation, disableBoxShadow} = this.options;
        Object.assign(this.options, WhiteTextButton.generateBoxShadowVariations(variation, disableBoxShadow));
    }

    @bindings.trigger()
    mimicDisabledContent() {
        this.options.disabledOptions.content = this.options.content;
    }


    constructor(options = {}) {
        super(options);
        this.on('newSize', (size) => {
            this.options.properties.lineHeight = this.options.disabledOptions.properties.lineHeight = `${size[1]}px`;
        }, {propagate: false})
    }


    getContent() {
        return this.text.getContent();
    }

    static generateBoxShadowVariations(variation, disableBoxShadow) {
        return {
            useBoxShadow: !(variation === 'noShadow' || disableBoxShadow),
            boxShadowType: variation
        }
    }
}