import {combineOptions}             from 'arva-js/utils/CombineOptions'
import {View}                       from 'arva-js/core/View.js';
import {layout, event}              from 'arva-js/layout/Decorators.js';

import {ImpactBig}                  from '../text/ImpactBig.js';
import {UISmallGray}                from '../text/UISmallGray.js';
import {Colors}                     from '../defaults/DefaultColors.js';

export class LabeledText extends View {

    /**
     * @param {Object} object Construction Options
     * @param {String} [options.label] Label
     * @parma {String} [options.text] Main Text
     */

    @layout.dock.top(function(){return this.options.labelHeight})
    @layout.size(true, function(){return this.options.labelHeight})
    label = new UISmallGray({
        content: `${this.options.label}`,
        properties: this.options.labelProperties
    });

    @layout.dock.top(function(){return this.options.labelHeight})
    @layout.size(true, function(){return this.options.labelHeight})
    text = new ImpactBig({
        content:  this.options.text,
        properties: this.options.textProperties,
    });

    constructor(options = {}){
        super(combineOptions({
            textHeight: 24,
            labelHeight: 24,
            labelProperties: {
                fontSize: "14px"
            },
            textProperties: {
                fontSize: "30px",
                color: Colors.PrimaryUIColor
            }
        }, options));
    }

    /**
     * Set the text of the text component
     * @param text
     */
    setText(text = ''){
        this.text.setContent(text)
    }

    /**
     * Set the text of the label component
     * @param text
     */
    setLabel(text = ''){
        this.label.setContent(text);
    }
}