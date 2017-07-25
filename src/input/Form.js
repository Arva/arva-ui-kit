/**
 * Created by chrwc on 5/2/17.
 */

import {View}                       from 'arva-js/core/View.js';
import {combineOptions}             from 'arva-js/utils/CombineOptions.js';

import {LabeledTextInput}           from 'arva-kit/input/LabeledTextInput.js';

export class Form extends View {

    constructor(options = {}) {
        super(combineOptions({
            inputNames: []
        }, options));

        this._inputNames = this.options.inputNames;
        this.setupStateListeners();
    }

    validate(inputName) {
        if (inputName) {
            if (this._inputNames.includes(inputName)) {
                if (this[inputName] && this[inputName].isStateCorrect()) {
                    this._eventOutput.emit('formFilledCorrectly');
                } else {
                    this._eventOutput.emit('formFilledIncorrectly');
                }
            }
        }
        else if (this.isStateCorrect()) {
            this._eventOutput.emit('formFilledCorrectly');
        }
        else {
            this._eventOutput.emit('formFilledIncorrectly');
        }
    }

    addInputName(renderableName) {
        let renderable = this[renderableName] || undefined;
        if (renderable) {
            this._inputNames.push(renderableName);
            this._setupStateListener(renderable);
            this.validate(renderableName);
        }
    }

    removeInputName(renderableName) {
        let nameIndex = this._inputNames.indexOf(renderableName);
        this._inputNames.splice(nameIndex, 1);
        this.validate();
    }

    getValue() {
        return undefined;
    }

    isStateCorrect() {
        let inputsCorrect = true;
        for (let renderableName of this._inputNames) {
            let renderable = this[renderableName] || undefined;
            if (renderable && !renderable.isStateCorrect()) {
                inputsCorrect = false;
            }
        }
        return inputsCorrect;
    }

    setupStateListeners() {
        for (let renderableName of this._inputNames) {
            let renderable = this[renderableName] || undefined;
            if (renderable) {
                this._setupStateListener(renderable);
            }
        }
    }

    _setupStateListener(inputRenderable) {
        inputRenderable.on('stateIncorrect', () => {
            this._eventOutput.emit('formFilledIncorrectly');
        });
        inputRenderable.on('stateCorrect', () => {
            if (this.isStateCorrect()) {
                this._eventOutput.emit('formFilledCorrectly');
            }
        });
    }

    clearAllInputs() {
        for (let renderableName in this.renderables) {
            let renderable = this[renderableName] || undefined;
            if (renderable instanceof LabeledTextInput) {
                renderable.clearInput();
            }
        }
    }
}