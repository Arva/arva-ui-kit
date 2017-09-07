/**
 * Created by lundfall on 21/09/16.
 */
import _toPairs                     from 'lodash/toPairs.js';
import {View}                       from 'arva-js/core/View.js';
import {flow, layout, event}        from 'arva-js/layout/Decorators.js';
import {combineOptions}             from 'arva-js/utils/CombineOptions.js';

import Surface                      from 'famous/core/Surface.js';

import {WhiteTextButton}                 from '../buttons/WhiteTextButton.js';
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
    background = new Surface({ properties: { backgroundColor: this.options.backgroundProperties.backgroundColor, borderRadius: this.options.properties.borderRadius } });

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
            borderRadius: this.options.borderRadius
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
        //TODO Remove the need for having borderRadius as a property of the root level on the options, it's a bit hacky. Better to have it under properties
        let borderRadius = options.borderRadius || options.rounded ? "24px" : "4px";

        super(combineOptions({
            //TODO Change to false once final
            fakeWithNative: true,
            items: [{ text: 'This is the selected item', selected: true, data: 1 }],
            eventName: 'itemChosen',
            placeholderOptions: {},
            properties: {
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius
            },
            backgroundProperties: {
                backgroundColor: 'white'
            }
        }, options));


        let { items, placeholder } = this.options;
        let selectedItemIndex = items.findIndex(({ selected }) => selected);

        if (this.options.fakeWithNative) {
            this.addRenderable(
                new Surface({
                    content: this._generateNativeDropdownHtml()
                }),
                'nativeSelect', layout.fullSize(), layout.translate(0, 0, 40)
            )

            if (selectedItemIndex === -1) {
                selectedItemIndex = 0;
            }
            this._selectedItem = this.options.items[selectedItemIndex];
            this.nativeSelect.on('change', (event) => {
                this._selectedItemIndex = event.target.selectedIndex;

                if(this.options.placeholder){
                    /* The placeholder takes up one space in the beginning,
                     * so decrease the index by 1 since you can't select the placeholder */
                    this._selectedItemIndex--;
                }
                let {items} = this.options;
                this._selectedItem = items[this._selectedItemIndex];
                for(let item of items){
                    if(item === this._selectedItem){
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }
                }

                this._eventOutput.emit(this.options.eventName, this._selectedItem.data);

                if(this.options.placeholder){
                    this.options.placeholder = null;
                    this.nativeSelect.setContent(this._generateNativeDropdownHtml());
                }
            });
            return this;
        }


        this._totalHeight = items.length * 32;


        if (placeholder) {
            this._addPlaceholder(placeholder);
        }

        for (let [index, item] of items.entries()) {
            this.addRenderable(
                new WhiteTextButton(this._getItemOptions(item.text)),
                this._getNameFromIndex(index),
                layout.dock.top(48),
                flow.defaultOptions({}),
                event.on('click', this.selectItemWithIndex.bind(this, index)),
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
            this.selectItemWithIndex(selectedItemIndex, false);
        }

        this._selectedItemIndex = selectedItemIndex;
        this._collapse();

        return this._containerView;
    }

    getValue() {
        return this.getSelectedItem();
    }

    getSelectedItem() {
        return this._selectedItem ? this._selectedItem.data : null;
    }

    /* Return a different size if collapsed or expanded */
    getSize() {
        if (this._collapsed) {
            return [undefined, 48];
        } else {
            return super.getSize();
        }
    }

    setItemText(index, text) {
        if(this.options.fakeWithNative){
            this.options.items[index].text = text;
            this.nativeSelect.setContent(this._generateNativeDropdownHtml());
        } else {
            console.log(`Dropdown.setItemText: Not supported for non-native`);
        }
    }

    getItems() {
        return this.options.items;
    }

    setPlaceholder(placeholder) {
        if(this.options.fakeWithNative){
            this.options.placeholder = placeholder;
        } else {
            console.log(`Dropdown.setPlaceholder: Not supported for non-native`);
        }
    }

    setItems(items) {
        if(this.options.fakeWithNative){
            return this.setItemsFakeWithNative(items);
        }
        console.log(`Dropdown.setItems: Not supported for non-native`);
    }

    setItemsFakeWithNative(items) {
        this.options.items = items;
        this._selectedItem = items.find(({selected}) => selected) || items[0];
        this.nativeSelect.setContent(this._generateNativeDropdownHtml());
        return this;
    }

    _addPlaceholder(placeholderText) {
        this._totalHeight += 32;
        this.addRenderable(
            new WhiteTextButton(combineOptions(this._getItemOptions(placeholderText, true), this.options.placeholderOptions)),
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
            borderTopLeftRadius: index === 0 ? (this.options.rounded ? '25px' : '4px') : '0px',
            borderTopRightRadius: index === 0 ? (this.options.rounded ? '25px' : '4px') : '0px',
            borderBottomLeftRadius: index === length - 1 ? (this.options.rounded ? '25px' : '4px') : '0px',
            borderBottomRightRadius: index === length - 1 ? (this.options.rounded ? '25px' : '4px') : '0px'
        }
    }

    _getStandardBorderProperties() {
        return {
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            borderTopLeftRadius: (this.options.rounded ? '25px' : '4px'),
            borderTopRightRadius: (this.options.rounded ? '25px' : '4px'),
            borderBottomLeftRadius: (this.options.rounded ? '25px' : '4px'),
            borderBottomRightRadius: (this.options.rounded ? '25px' : '4px')
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

    selectItemWithData(dataToSelect, emitEvent = true) {
        let indexToSelect = this.getItems().findIndex(
            ({data: dataObject}) => dataObject === dataToSelect);
        if(indexToSelect === -1){
            console.log(`Dropdown could not select item with data ${dataToSelect} (not found)`);
            return;
        }
        return this.selectItemWithIndex(indexToSelect, emitEvent);
    }
    async selectItemWithIndex(index, emitEvent = true) {
        if(this.options.fakeWithNative){
            this.options.items = this.options.items.map((item) => ({...item, selected: false}));
            this.options.items[index].selected = true;
            this.setItems(this.options.items);
            emitEvent && this._eventOutput.emit(this.options.eventName, this._selectedItem.data);
            return Promise.resolve();
        }
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

    _generateNativeDropdownHtml() {
        /* TODO Placeholder will only work in the following browsers
         * Google Chrome - v.43.0.2357.132
         * Mozilla Firefox - v.39.0
         * Safari - v.8.0.7 (Placeholder is visible in dropdown but is not selectable)
         * Microsoft Internet Explorer - v.11 (Placeholder is visible in dropdown but is not selectable)
         * Project Spartan - v.15.10130 (Placeholder is visible in dropdown but is not selectable)
         * */
        return `
            <select style ="
                ${this.options.placeholder ? this._getStyleStringFromProperties(this.options.placeholderOptions.properties) : ''}
                ${this._getStyleStringFromProperties(this.options.properties)}
                height: 48px;
                overflow: hidden;
                ${(this.options.backgroundProperties && this.options.backgroundProperties.backgroundColor) ? `background-color: ${this.options.backgroundProperties.backgroundColor};` : '' }
                padding: 0 0 0 16px;
                outline: none;
                -webkit-appearance: none; /* Doesn't work for IE and firefox */
                width: 100%;
            ">
            ${this.options.placeholder ? `<option value="" disabled selected  hidden>${this.options.placeholder} </option>` : ''}
            ${this.options.items.map((item) => `<option value=${item.data} ${item.selected ? 'selected' : ''}>${item.text}</option>`)}`
    }

    _getStyleStringFromProperties(properties) {
        return _toPairs(properties).map((pair) =>
                pair.map((string) =>
                    string.replace(/[A-Z]/g, (upperCaseCharacter) =>
                        `-${upperCaseCharacter.toLowerCase()}`)
                ).join(':')
            ).join('; ')
            + ';';
    }
}
