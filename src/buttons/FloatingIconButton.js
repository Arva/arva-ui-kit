/**
 * Created by lundfall on 12/07/16.
 */
import {combineOptions}                 from 'arva-js/utils/CombineOptions.js';
import {Colors}                         from '../defaults/DefaultColors.js';
import {ColoredTextButton}                from './ColoredTextButton.js';
import {WhiteIconButton}                    from './WhiteIconButton.js';


export class FloatingIconButton extends WhiteIconButton {
    constructor(options = {}) {
        super(combineOptions({
            ...ColoredTextButton.generateOptions(options),
            backgroundProperties: { backgroundColor: Colors.PrimaryUIColor, borderRadius: '50%' }
        }, options));
    }

    /* Default if true size specified */
    getSize() {
        return [64, 64];
    }
}
