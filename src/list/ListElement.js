/**
 * Created by vlad on 12/10/2016.
 */

import Easing                       from 'famous/transitions/Easing.js';

import {layout, flow, event}        from 'arva-js/layout/Decorators.js';
import {combineOptions}             from 'arva-js/utils/CombineOptions.js';

import {Clickable}                  from '../components/Clickable.js';
import {ListElementCard}            from './ListElementCard.js';
import {ImageButton}                from '../buttons/ImageButton.js';
import {CirclecheckIcon}            from '../icons/CirclecheckIcon.js';

const transition = {curve: Easing.outCubic, duration: 200};

@flow.viewStates({})
export class ListElement extends Clickable {

    @layout.size(undefined, function () {
        return this.options.elementHeight;
    })
    @layout.stick.top()
    @layout.translate(0, 0, 60)
    elementCard = new ListElementCard({
        image: this.options.image,
        icon: this.options.icon,
        text: this.options.text,
        sideText: this.options.sideText,
        previewText: this.options.previewText,
        profileImage: this.options.profileImage,
        statusColor: this.options.statusColor || undefined,
        bold: this.options.bold,
        backgroundProperties: {
            backgroundColor: this.options.backgroundColor
        },
        useBoxShadow: false,
        elementHeight: this.options.elementHeight
    });

    /**
     * ListElement that is used inside ListViews
     *
     * @example
     * listElement = new ListElement({
     *     text: 'First element',
     *     previewText: 'First element preview',
     *     image: bg,
     *     profileImage: true,
     *     icon: CloudIcon,
     *     backgroundColor: 'rgb(250, 250, 250)',
     *     sideText: 'Date & time stamp',
     *     statusColor: 'rgb(119, 190, 119)',
     *     leftButtons: [
     *         {icon: TrashIcon, backgroundColor: 'rgb(255, 63, 63)'},
     *         {icon: CloudIcon, backgroundColor: 'rgb(0, 188, 235)'}
     *     ],
     *     rightButtons: [
     *         {icon: TrashIcon, backgroundColor: 'rgb(255, 63, 63)'},
     *         {icon: AndroidshareIcon, backgroundColor: 'rgb(0, 188, 235)'}
     *     ],
     *     bold: true
     * });
     *
     * @param {Object} options Construction options
     * @param {String} [options.text] Set the main text inside the ListElement
     * @param {Boolean} [options.bold] Make the main text of the ListElement bold
     * @param {String} [options.previewText] Set the preview text underneath the main text
     * @param {File} [options.image] Image file to be used by the ListElement as a regular image or a profile image
     * @param {Boolean} [options.profileImage] Turns the image provided in the image option into a profile image
     * @param {Class} [options.icon] Icon class used to generate the ListElement icon
     * @param {String} [options.backgroundColor] Sets the color of the ListElementCard (used when alternating colors in a list)
     * @param {String} [options.sideText] Text to be displayed on the right side of the ListElement
     * @param {String} [options.statusColor] RGB color displayed as a triangle in the upper right corner of the ListElement
     * @param {Array} [options.leftButtons] Array of maximum two objects containing settings for the buttons
     *        on the left side of ListElement - icon and background color (see example)
     * @param {Array} [options.rightButtons] Array of maximum two objects containing settings for the buttons
     *        on the right side of ListElement - icon and background color (see example)
     * @param {Number} [options.elementHeight] Sets the height of the ListElement
     */
    constructor(options = {}) {
        super(combineOptions({
            elementHeight: 64
        }, options));

        /*This removes the default dock padding from Button class.*/
        this.decorateRenderable(
            'elementCard',
            layout.dockPadding(0)
        );

        let leftButtonsOptions = this.options.leftButtons;
        let rightButtonsOptions = this.options.rightButtons;
        if (leftButtonsOptions || rightButtonsOptions) {
            this.amountButtons = [0, 0];
            if (leftButtonsOptions) {
                this.amountButtons[0] = (leftButtonsOptions.length <= 2) ? leftButtonsOptions.length : 2;
                this._addButtons(this.amountButtons[0], leftButtonsOptions, 'left');
            }

            if (rightButtonsOptions) {
                this.amountButtons[1] = (rightButtonsOptions.length <= 2) ? rightButtonsOptions.length : 2;
                this._addButtons(this.amountButtons[1], rightButtonsOptions, 'right');
            }

            this._makeCardSlide(this.amountButtons[0], this.amountButtons[1]);
            this._enableSnapping();

            this.elementCard.draggable.on('update', () => {
                this.elementCard.ripple.hide();
            });
        }

        this.onceNewSize().then(([width]) => {
            this._width = width;

            if (this.amountButtons && (this.amountButtons[0] > 0 || this.amountButtons[1] > 0)) {
                let settings = this._getCardFlowSettings();
                this.decorateRenderable(
                    'elementCard',
                    layout.stick[settings.position](),
                    flow.stateStep('pressed', transition,
                        layout.size(() => {
                            return this._width - settings.offset;
                        }, this.options.elementHeight)),
                    flow.stateStep('released', transition,
                        layout.size(() => {
                            return this._width;
                        }, this.options.elementHeight)),
                    event.on('touchstart', function () {
                        this._pressCard();
                    }),
                    event.on('mousedown', function () {
                        this._pressCard();
                    })
                );
            }

            this.onNewSize(this._onResize);
        });
    }

    _onResize([width]) {
        this._width = width;
    }

    _pressCard() {
        if (this.elementCard.draggable.getPosition()[0] === 0) {
            this.setRenderableFlowState('elementCard', 'pressed');
        }
    }

    _releaseCard() {
        if (this.amountButtons[0] > 0 || this.amountButtons[1] > 0) {
            this.setRenderableFlowState('elementCard', 'released');
        }
    }

    _getCardFlowSettings() {
        if (this.amountButtons[0] > 0 && this.amountButtons[1] > 0) {
            return {offset: 8, position: 'center'};
        } else if (this.amountButtons[0] > 0) {
            return {offset: 4, position: 'right'};
        } else if (this.amountButtons[1] > 0) {
            return {offset: 4, position: 'left'};
        }
    }

    _addButtons(amountOfButtons, buttonsOptions, side) {
        for (let i = 0; i < amountOfButtons; i++) {
            this.addRenderable(
                new ImageButton({
                    icon: buttonsOptions[i].icon || CirclecheckIcon,
                    imageSize: [24, 24],
                    properties: {color: 'rgb(255, 255, 255)'},
                    backgroundProperties: {
                        borderRadius: '0px',
                        backgroundColor: buttonsOptions[i].backgroundColor
                    },
                    clickEventName: buttonsOptions[i].clickEventName || 'sideButtonClicked',
                    clickEventData: [this.options, side, i],
                    useBoxShadow: false,
                    variation: 'noShadow'
                }), side + 'Button' + i,
                layout.dock[side](),
                layout.size(this.options.elementHeight, this.options.elementHeight)
            );
        }
    }

    static _offset(amountButtons) {
        return amountButtons > 0 ? 4 : 0;
    }

    _makeCardSlide(amountLeftButtons, amountRightButtons) {
        this.decorateRenderable(
            'elementCard',
            layout.draggable({
                xRange: [
                    -amountRightButtons * this.options.elementHeight + ListElement._offset(amountRightButtons),
                    amountLeftButtons * this.options.elementHeight - ListElement._offset(amountLeftButtons)
                ],
                projection: 'x'
            })
        );
    }

    _enableSnapping() {
        this.elementCard.draggable.on('end', (event) => {
            let position = event.position[0];
            let newPosition = 0;
            if (position < 0) {
                let difference = this.amountButtons[1] * this.options.elementHeight;
                newPosition = Math.round(position / difference) * difference;
                if (newPosition !== 0) {
                    newPosition += ListElement._offset(this.amountButtons[1]);
                }
            } else if (position > 0) {
                let difference = this.amountButtons[0] * this.options.elementHeight;
                newPosition = Math.round(position / difference) * difference;
                if (newPosition !== 0) {
                    newPosition -= ListElement._offset(this.amountButtons[0]);
                }
            }

            if (newPosition === 0) {
                this._releaseCard();
            }

            if (newPosition !== position) {
                this.elementCard.draggable.setPosition([newPosition, 0], transition);
            }
        });
    }

    getSize() {
        return [undefined, this.options.elementHeight];
    }

}