/**
 * Created by lundfall on 21/09/16.
 */

import {View}                       from 'arva-js/core/View.js';
import {flow, layout, event}        from 'arva-js/layout/decorators.js';
import {combineOptions}             from 'arva-js/utils/CombineOptions.js';

import Surface                      from 'famous/core/Surface.js';

import {TextButton}                 from '../buttons/TextButton.js';
import {UIRegular}                  from '../defaults/DefaultTypefaces.js';
import sideArrows                   from './dropdown/sideArrows.svg.txt!text';

import Easing                       from 'famous/transitions/Easing.js';
import AnimationController          from 'famous-flex/AnimationController.js';

let expandShrinkTransition = { curve: Easing.outCubic, duration: 2000 };
let fastTransition = { curve: Easing.outCubic, duration: 50 };

//TODO: Fix behaviour that happens when the content go outside the screen
//TODO: Fix behaviour to collapse when outside screen

@flow.viewStates({
    expanded: [{ extendButton: 'hidden' }],
    collapsed: [{ extendButton: 'shown' }]
})
@layout.translate(0, 0, 20)
export class Dropdown extends View {

    _collapsed = true;

    @flow.stateStep('hidden', {}, layout.opacity(0))
    @flow.defaultState('shown', {}, layout.opacity(1), layout.stick.right(), layout.size(32, 32), layout.translate(-4, 0, 50))
    extendButton = new Surface({ content: sideArrows });

    @layout.translate(0, 0, 0)
    @layout.fullSize()
    background = new Surface({ properties: { backgroundColor: 'white', borderRadius: '4px' } });

    /* Using animate instead of flow state to avoid unwanted transitions when resizing */
    @layout.fullSize()
    @layout.animate({
        showInitially: false,
        animation: AnimationController.Animation.Fade,
        transition: fastTransition
    })
    shadow = new Surface({
        properties: {
            boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.12)',
            borderRadius: '4px'
        }
    });

    /**
     * Dropdown, which actually doesn't strictly drops down, but expands in both ways similar to drop downs from Safari
     * and various platforms. Emits the event 'itemChosen' (can be changed with options.evetName) with the
     * 'data' argument passed in the options.items.
     *
     * @param options
     * @param {Boolean} [options.fakeWithNative]. Set to true to fake with native
     * @param {Array} [options.items]. An array of options on the form {{String} text, {*} data, {Boolean} selected}.
     * Note that you should only set one of the items to "selected"
     * @param {String} [options.eventName]. The event name to emit when an item has been chosen. Defaults to 'itemChosen'
     * @param {String} [options.placeholder]. If set, makes a placeholder when nothing is selected yet. If any of the items
     * is selected, this parameter won't do anything
     *
     *
     * @returns {ContainerView}
     */
    constructor(options) {
        super(combineOptions({
            //TODO Change to false once final
            fakeWithNative: true,
            items: [{ text: 'This is the selected item', selected: true, data: 1 }],
            eventName: 'itemChosen'
        }, options));



        let { items, placeholder } = this.options;
        let selectedItemIndex = items.findIndex(({ selected }) => selected);

        if (this.options.fakeWithNative) {
            this.addRenderable(
                new Surface({
                    content: `
            <select style ="
                height: 48px;
                overflow: hidden;
                border: 1px solid rgba(0, 0, 0, 0.1);
                background-color: white;
                border-radius: 4px;
                padding: 0 0 0 16px;
                outline: none;
                -webkit-appearance: none; /* Doesn't work for IE and firefox */
                width: 100%;
            ">
    ${this.options.items.map((item) => `<option value=${item.data} ${item.selected ? 'selected' : ''}>${item.text}</option>`)}`
                }), 'nativeSelect', layout.fullSize(), layout.translate(0, 0, 40));
            if(selectedItemIndex === -1){
                selectedItemIndex = 0;
            }
            this._selectedItem = this.options.items[selectedItemIndex];
            this.nativeSelect.on('change', (event) => {
                this._selectedItemIndex = event.target.selectedIndex;
                this._selectedItem = this.options.items[this._selectedItemIndex];
                this._eventOutput.emit(this.options.eventName, this._selectedItem.data);
            });
            return this;
        }


        this._totalHeight = items.length * 32;



        if (placeholder) {
            this._addPlaceholder(placeholder);
        }

        for (let [index, item] of items.entries()) {
            this.addRenderable(
                new TextButton(this._getItemOptions(item.text)),
                this._getNameFromIndex(index),
                layout.dock.top(48),
                flow.defaultOptions({}),
                event.on('click', this._selectItemWithIndex.bind(this, index)),
                layout.animate({
                    transition: fastTransition,
                    animation: AnimationController.Animation.Fade,
                    showInitially: item.selected
                }));
        }


        class ContainerView extends View {

            @layout.size(undefined, true)
            @flow.defaultOptions({ transition: expandShrinkTransition })
            dropdown = this;

            getSize() {
                return [undefined, 48];
            }
        }
        this._containerView = new ContainerView();
        this._containerView.getValue = this.getValue;

        if (selectedItemIndex > -1) {
            this._selectItemWithIndex(selectedItemIndex, false);
        }

        this._selectedItemIndex = selectedItemIndex;
        this._collapse();

        return this._containerView;
    }

    getValue() {
        return this.getSelectedItem();
    }

    getSelectedItem() {
        return this._selectedItem.data;
    }

    /* Return a different size if collapsed or exapnded */
    getSize() {
        if (this._collapsed) {
            return [undefined, 48];
        } else {
            return super.getSize();
        }
    }

    setItemsFakeWithNative(items) {
        this.removeRenderable('nativeSelect');
        this.addRenderable(
            new Surface({
                content: `
                <select style ="
                    height: 48px;
                    overflow: hidden;
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    background-color: white;
                    border-radius: 4px;
                    padding: 0 0 0 16px;
                    outline: none;
                    -webkit-appearance: none; /* Doesn't work for IE and firefox */
                    width: 100%;
                ">
                ${items.map((item) => `<option value=${item.data} ${item.selected ? 'selected' : ''}>${item.text}</option>`)}`
            }), 'nativeSelect', layout.fullSize(), layout.translate(0, 0, 40));
        this.nativeSelect.on('change', (event) => {
            this._eventOutput.emit(this.options.eventName, items[event.target.selectedIndex].data);
        });
        return this;
    }

    _addPlaceholder(placeholderText) {
        this._totalHeight += 32;
        this.addRenderable(
            new TextButton(this._getItemOptions(placeholderText, true)),
            'placeholder',
            layout.dock.top(48),
            flow.defaultOptions({}),
            layout.translate(0, 0, 50),
            event.on('click', this._placeholderChosen),
        )
    }

    _getItemOptions(text, isPlaceholder = false) {
        return combineOptions(UIRegular, {
            properties: {
                /* Use padding instead of @layout.dockPadding in order to make the surface cover the entire length */
                padding: '0 0 0 16px',
                color: isPlaceholder ? 'rgb(170, 170, 170)' : undefined,
                textAlign: 'left',
                cursor: 'pointer'
            },
            content: text,
            makeRipple: false,
            useBoxShadow: false,
            backgroundProperties: {
                backgroundColor: 'none',
                borderRadius: null,
                borderBottom: isPlaceholder ? '1px solid rgba(0, 0, 0, 0.1)' : undefined
            }
        })
    }

    _getExpandedBorderFromIndex(index) {
        let { length } = this.options.items;
        return {
            border: 'none',
            borderBottom: index === length - 1 ? 'none' : '1px solid rgba(0, 0, 0, 0.1)',
            borderTopLeftRadius: index === 0 ? '4px' : '0px',
            borderTopRightRadius: index === 0 ? '4px' : '0px',
            borderBottomLeftRadius: index === length - 1 ? '4px' : '0px',
            borderBottomRightRadius: index === length - 1 ? '4px' : '0px'
        }
    }

    _getStandardBorderProperties() {
        return {
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
            borderBottomLeftRadius: '4px',
            borderBottomRightRadius: '4px'
        }
    }

    _getNameFromIndex(index) {
        return `item${index}`;
    }


    async _placeholderChosen() {
        if (!this._collapsed) {
            await this._collapse();
            this.placeholder.background.setProperties(this._getStandardBorderProperties());
        } else {
            this._expand();
        }
    }

    async _selectItemWithIndex(index, emitEvent = true) {
        if (this.placeholder) {
            this.removeRenderable('placeholder');
            this._totalHeight -= 32;
        }
        if (!this._collapsed) {
            this._selectedItemIndex = index;
            let { items } = this.options;
            let item = this._selectedItem = items[index];
            await this._collapse();
            this[this._getNameFromIndex(index)].background.setProperties(this._getStandardBorderProperties());
            emitEvent && this._eventOutput.emit(this.options.eventName, item.data);
        } else {
            this._expand();
        }
    }


    async _collapse() {
        let renderableHideCallbackList = [];
        for (let [index] of this.options.items.entries()) {
            if (this._selectedItemIndex !== index) {
                let renderableName = this._getNameFromIndex(index);
                if (this.renderables[renderableName].get()) {
                    renderableHideCallbackList.push(this.hideRenderable(renderableName));
                }
            }
        }
        await Promise.all(renderableHideCallbackList);
        this.setViewFlowState('collapsed');
        this.hideRenderable('shadow');
        this._collapsed = true;
        this._containerView.layout.reflowLayout();
        this._containerView.decorateRenderable('dropdown', layout.translate(0, 0, 0));
        for (let [otherIndice] of this.options.items.entries()) {
            this.decorateRenderable(this._getNameFromIndex(otherIndice), layout.translate(...this._getThisTranslation()));
        }
        this.decorateRenderable('background', layout.translate(0, 0, 0));
    }


    async _expand() {
        await this.setViewFlowState('expanded');
        this.showRenderable('shadow');
        this._collapsed = false;
        this._containerView.layout.reflowLayout();

        for (let [index] of this.options.items.entries()) {
            let renderableName = this._getNameFromIndex(index);
            this.showRenderable(renderableName);
            this.decorateRenderable(renderableName, layout.translate(0, 0, 0));
            this[renderableName].background.setProperties(this._getExpandedBorderFromIndex(index));
        }
        this._containerView.decorateRenderable('dropdown', layout.translate(...this._getThisTranslation()));
        this.decorateRenderable('background', layout.translate(0, 0, 50));
    }

    /* The entire select "dropdown" translates according to what item is currently selected. This function returns
     *  the translate that should be used by the parent.
     */
    _getThisTranslation() {
        return [0, -this._totalHeight *
        (this.placeholder ? 0 : (this._selectedItemIndex / (this.options.items.length - 1)))
            , 50];
    }

}
