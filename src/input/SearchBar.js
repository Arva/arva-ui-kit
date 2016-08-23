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
import {CirclecrossIcon}        from '../icons/CirclecrossIcon.js';
import {SingleLineInputSurface} from './SingleLineInputSurface.js';

const BORDER_RADIUS = '4px';
const FADE = { transition: { duration: 200, curve: Easing.outCubic}, animation: AnimationController.Animation.Fade };

@layout.flow()
export class SearchBar extends View {

    @layout.stick.center()
    @layout.size(10000, 10000)
    @event.on('click', function() { this._onDeactivate(); })
    underlay = new Surface({ properties: { display: 'none' } });

    @layout.fullSize()
    @layout.stick.center()
    @layout.animate({...FADE})
    @layout.translate(-1, -1, 10) /* Compensate for border size */
    @event.on('click', function(e) { this._onActivate(e); })
    border = new Surface(combineOptions(
        { properties: {
            boxSizing: 'content-box',
            border: 'solid 1px rgba(0, 0, 0, 0.1)',
            borderRadius: BORDER_RADIUS
        }}
    ));

    @layout.size((width) => width, 32)
    // @layout.fullSize()
    @layout.stick.center()
    @layout.translate(0, 0, 20)
    @layout.animate({ showInitially: false, ...FADE })
    results = new Surface(
        { properties: {
            boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.12)',
            borderRadius: BORDER_RADIUS
        }}
    );

    @layout.size(16, 16)
    @layout.dock.right()
    @layout.stick.center()
    @layout.translate(-8, 0, 40)
    @layout.animate({ showInitially: false, ...FADE })
    cross = new CirclecrossIcon({ color: 'rgb(170, 170, 170)', properties: {
        cursor: 'pointer',
        fontSize: '16px'
    } });

    @layout.dock.right((width) => width - (4 * 16), 16)
    @layout.translate(0, 0, 30)
    @event.on('click', function(e) { this._onActivate(e); })
    @event.on('value', function(value) { this._onInputValue(value); })
    input = new SingleLineInputSurface(combineOptions(
        UIRegular,
        { properties: {
            borderRadius: BORDER_RADIUS,
            boxShadow: 'none',
            padding: '0px'
        }, placeholder: '' }
    ));

    @layout.size(~50, 32)
    @layout.stick.center()
    @layout.translate(0, 0, 40)
    @event.on('click', function(e) { this._onActivate(e); })
    @layout.animate(FADE)
    placeholder = new Placeholder({
            properties: { borderRadius: BORDER_RADIUS },
            placeholder: this.options.placeholder || 'Search'
        });

    async _onActivate(clickEvent) {
        clickEvent.preventDefault();
        this.input.blur();

        /* Show clickable underlay that collapses the search results on click. */
        this.underlay.setProperties({ display: 'block' });

        /* Move placeholder to the left */
        this.decorateRenderable('placeholder', layout.stick.left(), layout.translate(8, 0, 40));
        await new Promise((resolve) => setTimeout(resolve, 300));

        /* Change the border to a dropshadow */
        this._changeVisibility('results', true);
        await this._changeVisibility('border', false);
        this.input.focus();
    }

    async _onDeactivate () {
        // this.input.blur();

        /* Hide underlay. */
        this.underlay.setProperties({ display: 'none' });

        /* Only move the placeholder back to the center if no text in input field */
        if(this.input.getValue().length === 0) {
            this.decorateRenderable('placeholder', layout.stick.center(), layout.translate(0, 0, 40));
        }

        this._changeVisibility('results', false);
        await this._changeVisibility('border', true);
    }
    
    async _onInputValue(value) {
        let hasContent = value.length > 0;
        this._changeVisibility('cross', hasContent);
        this.placeholder[hasContent ? 'hideText' : 'showText']();
    }

    _changeVisibility(renderableName, show = true) {
        let renderable = this[renderableName];

        /* TODO: there is no 'once' on Surfaces, using 'on' will degrade performance over time. */
        let promise = callbackToPromise(renderable.on.bind(renderable), show ? 'shown' : 'hidden');
        this[show ? 'showRenderable' : 'hideRenderable'](renderableName);
        return promise;
    }
}
