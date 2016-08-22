/**
 * Created by tom on 19/08/16.
 */

import Surface                  from 'famous/core/Surface.js';
import Easing                   from 'famous/transitions/Easing.js';
import AnimationController      from 'famous-flex/AnimationController.js';

import {View}                   from 'arva-js/core/View.js';
import {layout, event}          from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {callbackToPromise}      from 'arva-js/utils/CallbackHelpers.js';
import {UISmallGrey,
        UIRegular}              from 'arva-kit/defaults/DefaultTypeFaces.js';

import {Placeholder}            from './searchBar/Placeholder.js';
import {SingleLineInputSurface} from './SingleLineInputSurface.js';

export class SearchBar extends View {
    static borderRadius = '4px';
    static fade = { transition: { duration: 200, curve: Easing.outCubic}, animation: AnimationController.Animation.Fade };

    @layout.stick.center()
    @layout.size(10000, 10000)
    @event.on('click', function() { this._onDeactivate(); })
    underlay = new Surface({ properties: { display: 'none' } });

    @layout.size(480, 32)
    @layout.stick.center()
    @layout.translate(-1, -1, 10) /* Compensate for border size */
    @event.on('click', function() { this._onActivate(); })
    @layout.animate({ transition: {duration: 200, curve: Easing.outCubic}, animation: AnimationController.Animation.Fade })
    border = new Surface(combineOptions(
        { properties: {
            boxSizing: 'content-box',
            border: 'solid 1px rgba(0, 0, 0, 0.1)',
            borderRadius: SearchBar.borderRadius
        }}
    ));

    @layout.size(480, 32)
    @layout.stick.center()
    @layout.translate(0, 0, 20)
    @layout.animate({ showInitially: false, transition: {duration: 200, curve: Easing.outCubic}, animation: AnimationController.Animation.Fade })
    results = new Surface(
        { properties: {
            boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.12)',
            borderRadius: SearchBar.borderRadius
        }}
    );

    @layout.size(480, 32)
    @layout.stick.center()
    @layout.translate(0, 0, 30)
    @event.on('click', function(e) { this._onActivate(e); })
    input = new SingleLineInputSurface(combineOptions(
        UIRegular,
        { properties: { borderRadius: SearchBar.borderRadius }, placeholder: 'Looky looky' }
    ));

    @layout.size(~50, 32)
    @layout.stick.center()
    @layout.translate(0, 0, 40)
    @event.on('click', function(e) { this._onActivate(e); })
    placeholder = new Placeholder(combineOptions(
        UISmallGrey,
        {
            properties: { borderRadius: SearchBar.borderRadius },
            placeholder: this.options.placeholder || 'Search'
        }
    ));

    async _onActivate(clickEvent) {
        clickEvent.preventDefault();

        /* Show clickable underlay that collapses the search results on click. */
        this.underlay.setProperties({ display: 'block' });

        this._changeVisibility('results', true);
        await this._changeVisibility('border', false);
        this.input.focus();
    }

    async _onDeactivate () {
        this.input.blur();

        /* Hide underlay. */
        this.underlay.setProperties({ display: 'none' });

        this._changeVisibility('results', false);
        await this._changeVisibility('border', true);
    }

    _changeVisibility(renderableName, show = true) {
        this[show ? 'showRenderable' : 'hideRenderable'](renderableName);

        let renderable = this[renderableName];
        /* TODO: there is no 'once' on Surfaces, using 'on' will degrade performance over time. */
        return callbackToPromise(renderable.on.bind(renderable), show ? 'shown' : 'hidden');
    }
}

