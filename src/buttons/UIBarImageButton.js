/**
 * Created by lundfall on 12/07/16.
 */

import {combineOptions}                     from 'arva-js/utils/CombineOptions.js';

import {Colors}                             from '../defaults/DefaultColors.js';
import {ImageButton}                        from './ImageButton.js';
import {bindings}                           from 'arva-js/layout/Decorators.js';

@bindings.setup({
    backgroundProperties: {
        backgroundColor: 'none'
    },
    uiBarVariation: 'white',
    makeRipple: false
})
export class UIBarImageButton extends ImageButton {

    @bindings.trigger()
    setColorBasedOnVariation(options) {
        let {uiBarVariation} = options;
        if(uiBarVariation === 'white'){
            return options.properties.color = Colors.PrimaryUIColor;
        }
        if(uiBarVariation === 'colored'){
            return options.properties.color = 'white';
        }
    }


    setVariation(variation) {
        console.log(`Deprecated method setVariation called from ${this._name()}`);
    }

}
