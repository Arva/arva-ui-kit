/**
 * Created by tom on 19/08/16.
 */

import Surface                  from 'famous/core/Surface.js';
import Easing                   from 'famous/transitions/Easing.js';

import {View}                   from 'arva-js/core/View.js';
import {layout, event, flow}    from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {callbackToPromise}      from 'arva-js/utils/CallbackHelpers.js';
import {
    UISmallGrey,
    UIRegular
}                               from 'arva-kit/defaults/DefaultTypeFaces.js';

import {UIBarTextButton}        from '../buttons/UIBarTextButton.js';
import {Dimensions}             from '../defaults/DefaultDimensions.js';
import {MultiLineInputView}     from './MultiLineInputView.js';

let {searchBar: {borderRadius}} = Dimensions;

@layout.dockPadding(0)
@flow.viewStates({
    active: [{boxShadow: 'shown', border: 'hidden'}],
    inactive: [{boxShadow: 'hidden', border: 'shown'}]
})
export class MessageField extends View {

    @event.on('click', function (e) {
        this._onActivate(e);
    })
    @flow.stateStep('hidden', {}, layout.opacity(0))
    @flow.defaultState('shown', {}, layout.fullSize(), layout.opacity(1), layout.translate(0, 0, 10))
    border = new Surface(combineOptions(
        {
            properties: {
                boxSizing: 'content-box',
                border: 'solid 1px rgba(0, 0, 0, 0.1)',
                borderRadius
            }
        }
    ));

    @layout.fullSize()
    background = new Surface({properties: {backgroundColor: 'white'}});


    @flow.stateStep('shown', {}, layout.opacity(1))
    @flow.defaultState('hidden', {}, layout.fullSize(), layout.opacity(0), layout.translate(0, 0, 10))
    boxShadow = new Surface({
        properties: {
            boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.12)',
            borderRadius
        }
    });

    @flow.defaultState('default', {}, layout.opacity(1), layout.size(true, (_, height) => Math.min(height, 32)), layout.stick.bottomRight(), layout.translate(0, 1, 10))
    sendButton = new UIBarTextButton({
        content: navigator && !navigator.onLine ? 'Offline' : 'Send',
        properties: {cursor: 'pointer'},
        enabled: false,
        clickEventName: 'send'
    });

    

    getSize() {
        return [undefined, this._currentViewFlowState() === 'active' ? Math.max(super.getSize()[1] || 0, 32) : 32];
    }

    @flow.stateStep('hidden', {}, layout.opacity(0), layout.skew(0.9, 0, 0))
    @flow.defaultState('shown', {}, layout.opacity(1), layout.skew(0, 0, 0))
    @event.on('click', function (e) {
        this._onActivate(e);
    })
    @event.on('focus', function(e) { this._onFocusEvent(e, 'focus'); })
    @event.on('blur', function(e) { this._onFocusEvent(e, 'blur'); })
    @event.on('input', function (value) {
        this._onNewInput(value);
    })
    @layout.translate(16, 0, 10)
    @layout.size(function (width) {
        return width - (this.getResolvedSize('sendButton')[0] || 0) - 16;
    }, function () {
        return this._currentViewFlowState() === 'active' ? ~32 : 32
    })
    @layout.translate(0, 1, 30)
    input = new MultiLineInputView(combineOptions(
        UIRegular,
        {
            initialHeight: 2,
            properties: {
                backgroundColor: 'transparent',
                lineHeight: '32px',
                border: 'none',
                padding: '0px'
            },
            placeholder: this.options.placeholder
        }
    ));

    _onNewInput() {
        let value = this.input.getValue();
        if (value && (!navigator || (navigator && navigator.onLine))) {
            this.sendButton.enable();
        } else {
            this.sendButton.disable();
        }
    }

    constructor(options) {
        super(combineOptions({
            placeholder: 'Enter a message'
        }, options));
        document.addEventListener("offline", () => {
            this.sendButton.setContent('offline');
            this.sendButton.disable();
        });
        document.addEventListener("online", () => {
            this.sendButton.setContent('send');
            if(this.input.getValue()){
                this.sendButton.enable();
            }
        });

        this.on('send', () => {
            this._dontLooseFocus = true;
            this.sendButton.disable();
            this.setRenderableFlowState('input', 'hidden').then(() => {
                this._eventOutput.emit('message', this.input.getValue());
                this.input.setValue('');
                this.setRenderableFlowState('input', 'shown');
                this._dontLooseFocus = false;
            })

        });
    }

    _enableFocusEvents() {
        this.inFocusEvent = false;
    }

    _disableFocusEvents() {
        this.inFocusEvent = true;
    }


    _onDeactivate () {

        setTimeout(() => {
            if(!this._dontLooseFocus){
                this.input.input.setProperties({ overflow: 'auto'});
                this.setViewFlowState('inactive');
                this.reflowRecursively();
                this.input.scrollToTop();
                this.sendButton.disable();
            }

        }, 100);
        return true;
    }

    async _onFocusEvent(event, type) {
        if(this.inFocusEvent) { return; }
        type === 'focus' ? await this._onActivate(event) : this._onDeactivate(event);
    }

    /* Complex logic because the focusing has to be delayed */
    async _onActivate(event = {}) {
        if(event.preventDefault) { event.preventDefault(); }
        if(this._currentViewFlowState() === 'active') { return false; }
        this._disableFocusEvents();
        this.input.blur();
        this.reflowRecursively();

        await this.setViewFlowState('active');

        this._onNewInput();
        this.input.focus();
        this._enableFocusEvents();
        return true;
    }

    _currentViewFlowState() {
        return this.decorations.flow.currentState;
    }
}
