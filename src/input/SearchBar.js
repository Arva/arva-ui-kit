/**
 * Created by tom on 19/08/16.
 */

import Surface                  from 'famous/core/Surface.js';
import Easing                   from 'famous/transitions/Easing.js';

import {View}                   from 'arva-js/core/View.js';
import {layout, event, flow}    from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {
    UISmallGrey,
    UIRegular
}                               from 'arva-kit/defaults/DefaultTypeFaces.js';

import {ResultsView}            from './searchBar/ResultsView.js';
import {Placeholder}            from './searchBar/Placeholder.js';
import {SingleLineInputSurface} from './SingleLineInputSurface.js';
import {UIBarTextButton}        from '../buttons/UIBarTextButton.js';
import {Dimensions}             from '../defaults/DefaultDimensions.js';

let {searchBar: {borderRadius}} = Dimensions;
const instant = { transition: { curve: Easing.outCubic, duration: 0 } };
const transition = { transition: { curve: Easing.outCubic, duration: 200 } };

/**
 * A highly animated search bar that takes a single line of text input, and shows search results from the input
 * in a DataBoundScrollView that expands and collapses below the text input field. Used exclusively inside a UIBar.
 *
 * If no itemTemplate or groupTemplate is given, the results section will create generic renderables from the given
 * options.dataStore's item's .content and .group properties, respectively.
 *
 * @example
 * list = new MyResults() // Extends LocalPrioritisedArray
 *
 * @layout.dock.top(~48)
 * bar = new UIBar({
          centerItemSize: [320, 48],
 *        components: [
 *            [new SearchBar({resultOptions: {
 *                dataStore: list,
 *                itemTemplate: (model) => new Surface({ content: model.content }),
 *                groupBy: (model) => model.group || 'empty group'
 *            }}), 'search', 'center']
 *        ]
 *    });
 *
 * // The user entered new search input
 * bar.on('value', (value) => {
 *      // [..] remove irrelevant previous results
 *
 *      list.add({content: 'SomeResultName', group: 'SomeGroup'});
 * })
 *
 * // OR:
 *
 * bar.on('value', (value) => {
 *      // Override existing results list with a new one
 *      list = new MyResults();
 *      list.add({content: 'SomeResultName', group: 'SomeGroup'});
 *      // Update the SearchBar's results dataStore
 *      this.bar.search.showResults(list);
 * })
 *
 *
 * @param {Object} [options] Construction options
 * @param {String} [options.placeholder] Placeholder to show when no text is entered
 * @param {Object} [options.resultOptions] Options that are passed onto the ResultsView, which passes them into its DataBoundScrollView
 * @param {PrioritisedArray} [options.resultOptions.dataStore] A (Local)PrioritisedArray containing the results of the input search string.
 * @param {Number} [options.resultOptions.itemHeight] Height of the result items, in pixels
 * @param {Number} [options.resultOptions.groupHeight] Height of the result items' group headers, in pixels
 * @param {Function} [options.resultOptions.itemTemplate] A constructor that takes in a Model and returns a renderable for an item
 * @param {Function} [options.resultOptions.groupTemplate] A constructor that takes in a group value of any type and returns a renderable for a group header
 */
@flow.viewStates({
    'active': [{ border: 'hidden', results: 'shown'}],
    'inactive': [{ border: 'shown', results: 'hidden' }]
})
export class SearchBar extends View {

    /* Translation of -1, -1 is to correct for the border being on the outside of the surface */
    @event.on('click', function(e) { this._onActivate(e); })
    @flow.stateStep('hidden', transition, layout.opacity(0))
    @flow.defaultState('shown', transition, layout.size(undefined, 32), layout.stick.center(), layout.opacity(1), layout.translate(-1, -1, 210))
    border = new Surface(combineOptions(
        { properties: {
            boxSizing: 'content-box',
            backgroundColor: 'rgb(255, 255, 255)',
            border: 'solid 1px rgba(0, 0, 0, 0.1)',
            borderRadius: borderRadius
        }}
    ));

    @flow.stateStep('shown', transition, layout.opacity(1))
    @flow.stateStep('expanded', transition, layout.size(undefined, true))
    @flow.stateStep('collapsed', transition, layout.size(undefined, 32))
    @flow.stateStep('hidden', transition, layout.size(undefined, 32))
    @flow.defaultState('hidden', transition, layout.opacity(0), layout.size(undefined, 32),
        layout.stick.top(), layout.translate(0, 8, 210))
    results = new ResultsView({
        resultOptions: this.options.resultOptions
    });

    @event.on('click', function(e){ this._onDoneClick(e); })
    @flow.stateStep('shown', instant, layout.size(~50, undefined), layout.translate(0, 0, 260))
    @flow.stateStep('shown', transition,layout.opacity(1))
    @flow.stateStep('hidden', transition, layout.opacity(0))
    @flow.defaultState('hidden', instant, layout.opacity(0), layout.dock.right(), layout.size(1, 1), layout.translate(0, 0, 220))
    done = new UIBarTextButton({ content: 'Done', properties: { cursor: 'pointer' }});

    @layout.dock.fill()
    @layout.translate(0, 0, 250)
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
    @flow.stateStep('left', transition, layout.stick.left(), layout.translate(8, 0, 230))
    @flow.defaultState('center', transition, layout.size(~50, 32), layout.stick.center(), layout.translate(0, 0, 230))
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
        await type === 'focus' ? this._onActivate(event) : this._onDeactivate(event);
    }

    async _onActivate() {
        if(this.getViewFlowState() === 'active') { return false; }

        if(this.getRenderableFlowState('placeholder') !== 'left') {
            this.setRenderableFlowState('placeholder', 'left');
        }
        await this.setViewFlowState('active');

        if(this.input.getValue()) {
            this.setRenderableFlowState('results', 'expanded');
        }

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
}
