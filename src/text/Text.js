/**
 * Created by tom on 08/06/15.
 */
import _                  from 'lodash';
import Surface            from 'famous/core/Surface.js';
import {combineOptions}   from 'arva-js/utils/CombineOptions.js';
import {TextBody}         from '../defaults/DefaultTypefaces.js';
import Encoder            from 'node-html-encoder';

import {HTMLTextTransformer}       from '../defaults/Transformers';

/**
 * Since we don't want 'defaults' that we can set globally, we need this class to be able to have options set up
 * by default for Text.
 */
class Base extends Surface {
    constructor(options) {
        super(options);
        this.options = options;
    }
}

export class Text extends Base {
    constructor(options){
        super(combineOptions({...TextBody}, {transform:true, transformer: HTMLTextTransformer, ...options, content:''}));

        this._originalContent = options.content;

        if (this.options.transform && this.options.transformer) {
            this._newContent = this.options.transformer(options.content);
            super.setContent(this._newContent);
        } else {
            super.setContent(options.content)
        }
    }

    setContent(content) {
        this._originalContent = content;
        if (this.options.transform && this.options.transformer && _.isString(content)) {
            this._newContent = this.options.transformer(content);
            super.setContent(this._newContent);
        } else {
            super.setContent(content)
        }
    }

    getValue() {
        return this._originalContent;
    }
}
