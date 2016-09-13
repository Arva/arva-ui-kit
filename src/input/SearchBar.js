/**
 * Created by tom on 19/08/16.
 */

import Surface                  from 'famous/core/Surface.js';
import Easing                   from 'famous/transitions/Easing.js';

import {View}                   from 'arva-js/core/View.js';
import {layout, event, flow}    from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {callbackToPromise}      from 'arva-js/utils/CallbackHelpers.js';
import {UISmallGrey,
        UIRegular}              from 'arva-kit/defaults/DefaultTypeFaces.js';

import {ResultsView}            from './searchBar/ResultsView.js';
import {Placeholder}            from './searchBar/Placeholder.js';
import {SingleLineInputSurface} from './SingleLineInputSurface.js';
import {UIBarTextButton}        from '../buttons/UIBarTextButton.js';
import {Dimensions}             from '../defaults/DefaultDimensions.js';

let {searchBar: {borderRadius}} = Dimensions;
const instant = { transition: { curve: Easing.outCubic, duration: 0 } };
const transition = { transition: { curve: Easing.outCubic, duration: 200 } };

@flow.viewStates({
    'active': [{ border: 'hidden', results: 'shown'}],
    'inactive': [{ border: 'shown', results: 'hidden' }]
})
export class SearchBar extends View {

    @event.on('click', function(e) { this._onActivate(e); })
    @flow.stateStep('hidden', transition, layout.opacity(0))
    @flow.defaultState('shown', transition, layout.size(undefined, 32), layout.stick.center(), layout.opacity(1), layout.translate(-1, -1, 10))
    border = new Surface(combineOptions(
        { properties: {
            boxSizing: 'content-box',
            border: 'solid 1px rgba(0, 0, 0, 0.1)',
            borderRadius: borderRadius
        }}
    ));

    /* TODO: remove size when results is its own component */
    @flow.stateStep('shown', transition, layout.opacity(1))
    @flow.stateStep('expanded', transition, layout.size(undefined, true))
    @flow.stateStep('collapsed', transition, layout.size(undefined, 32))
    @flow.stateStep('hidden', transition, layout.size(undefined, 32))
    @flow.defaultState('hidden', transition, layout.opacity(0), layout.size(undefined, 32),
                                 layout.stick.top(), layout.translate(0, 8, 10))
    results = new ResultsView({
        resultOptions: this.options.resultOptions
    });

    @event.on('click', function(e){ this._onDoneClick(e); })
    @event.on('deploy', function(e){
        window.globDone = this.done;
        window.text = this.done.text;
        text.___size = [1,1];
        text.__size = [1,1];

        Object.defineProperty(text.__size, '0', {
            get: function() {
                return text.___size[0];
            },
            set: function(value) {
                if(Number.isNaN(value)){
                    debugger;
                }
                text.___size[0] = value;
            }
        });

        Object.defineProperty(text.__size, '1', {
            get: function() {
                return text.___size[1];
            },
            set: function(value) {
                if(Number.isNaN(value)){
                    debugger;
                }
                text.___size[1] = value;
            }
        });

        Object.defineProperty(text, '_size', {
            get: function() {
                return this.__size;
            },
            set: function(value) {
                if (Number.isNaN(value[0]) || Number.isNaN(value[1])) {
                    debugger;
                }

                var a = text._size;

                this.__size[0] = value[0];
                this.__size[1] = value[1];
            }
        });
    })
    @flow.stateStep('shown', instant, layout.size(true, undefined), layout.translate(0, 0, 40))
    @flow.stateStep('shown', transition,layout.opacity(1))
    @flow.stateStep('hidden', transition, layout.opacity(0))
    @flow.defaultState('hidden', instant, layout.opacity(0), layout.dock.right(), layout.size(1, 1), layout.translate(0, 0, 20))
    done = new UIBarTextButton({ content: 'Done', properties: { cursor: 'pointer' }});

    @layout.dock.fill()
    @layout.translate(0, 0, 30)
    @event.on('click', function(e) { this._onActivate(e); })
    @event.on('focus', function(e) { this._onFocusEvent(e, 'focus'); })
    @event.on('blur', function(e) { this._onFocusEvent(e, 'blur'); })
    @event.on('value', function(value) { this._onInputValue(value); })
    input = new SingleLineInputSurface(combineOptions(
        UIRegular,
        { properties: {
            backgroundColor: 'transparent',
            borderRadius: borderRadius,
            boxShadow: 'none',
            padding: '0px 0px 0px 32px'
        }, placeholder: '' , clearOnEnter: false}
    ));

    @event.on('click', function(e) { this._onActivate(e); })
    @flow.stateStep('left', transition, layout.stick.left(), layout.translate(8, 0, 40))
    @flow.defaultState('center', transition, layout.size(~50, 32), layout.stick.center(), layout.translate(0, 0, 30))
    placeholder = new Placeholder({
            properties: { borderRadius: borderRadius },
            placeholder: this.options.placeholder || 'Search'
        });

    /**
     * Shows the models in the given results list inside the results DataBoundScrollView. Replaces old results.
     * @param {PrioritisedArray} results List of models to use in the ResultsView.
     */
    showResults(results) {
        this.results.content.setDataStore(results);
    }

    /* Allow receiving focus e.g. through the keyboard, or programmatically (i.e. element.focus()). */
    async _onFocusEvent(event, type) {
        if(this.inFocusEvent) { return; }
        await type === 'focus' ? this._onActivate(event) : this._onDeactivate(event);
    }

    async _onActivate(event = {}) {
        if(event.preventDefault) { event.preventDefault(); }
        if(this._currentViewFlowState() === 'active') { return false; }
        this._disableFocusEvents();
        this.input.blur();

        if(this._currentRenderableFlowState('placeholder') !== 'left') {
            this.setRenderableFlowState('placeholder', 'left');
        }
        await this.setViewFlowState('active');

        if(this.input.getValue()) {
            this.setRenderableFlowState('results', 'expanded');
        }

        this.input.focus();
        this._enableFocusEvents();
        return true;
    }

    async _onDeactivate () {
        this.setViewFlowState('inactive');

        /* Only move the placeholder back to the center if no text in input field */
        if(this.input.getValue().length === 0) {
            await this.setRenderableFlowState('placeholder', 'center');
        }
        return true;
    }

    async _onDoneClick (event) {
        if(event.preventDefault) { event.preventDefault(); }
        this.input.setValue('');
        this._onInputValue('');
        this._onDeactivate();
    }

    async _onInputValue(value) {
        let hasContent = value.length > 0;
        this.placeholder[hasContent ? 'hideText' : 'showText']();
        this.setRenderableFlowState('results', hasContent ? 'expanded' : 'collapsed');
        await this.setRenderableFlowState('done', hasContent ? 'shown' : 'hidden');
    }

    /* TODO: add this in View.js properly after Karl's refactor */
    _currentViewFlowState() {
        return this.decorations.flow.currentState;
    }

    _currentRenderableFlowState(renderableName) {
        return this[renderableName].decorations.flow.currentState;
    }

    _enableFocusEvents() {
        this.inFocusEvent = false;
    }

    _disableFocusEvents() {
        this.inFocusEvent = true;
    }
}
