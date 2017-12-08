/**
 * Created by lundfall on 11/24/15.
 */

import moment                       from 'moment';
import _                            from 'lodash';
import Surface                      from 'famous/core/Surface';
import AnimationController          from 'famous-flex/AnimationController.js';
import Transform                    from 'famous/core/Transform';
import ContainerSurface             from 'famous/surfaces/ContainerSurface';
import Timer                        from 'famous/utilities/Timer.js';


import {View}                       from 'arva-js/core/View';

import {InputSurface}               from './../InputSurface.js';
import {CalendarHeader}             from './CalendarHeader.js';
import {DayPicker}                  from './DayPicker.js';
import {Calendar}                   from './Calendar.js';


import BkImageSurface               from 'famous-bkimagesurface/BkImageSurface.js';
import expandArrow                  from '../../icons/resources/arrowdown_angular_bold.svg!arva-js/utils/ImageLoader.js';
import collapseArrow                from '../../icons/resources/arrowup_angular_bold.svg!arva-js/utils/ImageLoader.js';

export class CalendarInput extends View {

    static get DEFAULT_OPTIONS() {

        return {
            dateFormat: "DD/MM/YYYY",
            extensionButtonImageUrl: 'img/expand_arrow.svg',
            calendarWidth: 270,
            calendarHeight: 185,
            headerHeight: 30,
            fadeSpeed: 100,
            value: new Date(),
            'padding-left': 6
        };
    }

    constructor(options) {
        options = _.merge(CalendarInput.DEFAULT_OPTIONS, options);
        super();

        this.name = options.name;
        this.options = options;

        this._initCalendar();


        if (this.options.value) {
            this.date = this.options.value;
            this.options.value = this._formatDate(this.options.value);
        }

        this.renderables.calendarInputField = new InputSurface(
            _.merge(this.options, {
                type: 'text',
                properties: {
                    border: options.properties.border ? options.properties.border : '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: options.rounded ? '24px' : '4px',
                },
                placeholder: this.options.dateFormat.toLowerCase(),
                //Prevent inputfield from centering placeholder because it looks ugly with this type of field
                classes: ['leftAlignedPlaceholder']
            }));


        this.renderables.calendarInputField.on('valueChange', this._onFieldChange);


        this.renderables.extensionArrow = new BkImageSurface({
            content: expandArrow,
            sizeMode: '30% auto',
            positionMode: BkImageSurface.PositionMode.CENTER,
            properties: {
                cursor: 'pointer'
            }
        });

        this.renderables.calendar = new AnimationController({
            transition: { duration: 150, curve: 'easeInOut' },
            animation: (show, size) => {
                return {
                    transform: Transform.translate(0, show ? -0.1 * size[1] : 0.1 * size[1], 0),
                    opacity: AnimationController.Animation.Fade(show, size).opacity
                };
            }
        });

        this.layouts.push((context) => {

            context.set('calendar', {
                size: [this.options.calendarWidth, this.options.calendarHeight],
                origin: [0, 0],
                align: [0, 1],
                translate: [0, 0, 100]
            });


            context.set('extensionArrow', {
                size: [context.size[0] / 8, context.size[0] / 8],
                origin: [1, 0.5],
                align: [1, 0.5],
                translate: [0, 0, 5]
            });

            context.set('calendarInputField', {
                size: [undefined, undefined],
                origin: [0, 0],
                align: [0, 0],
                translate: [0, 0, 0]
            });
        });

        this._initMouseBehaviour();


        this.calendar.on('datePicked', async (date) =>{
            this.date = date;
            let dateText = this._formatDate(date);
            this.renderables.calendarInputField.setValue(dateText);
            if (this.getValue() !== this._formatDate(date)) {
                await this.renderables.calendarInputField.once('deploy');
            }
            this._eventOutput.emit('datePicked', date);
            setTimeout(() => this._setCalendarVisible(false), 150);
        }.bind(this));
    }

    _initCalendar() {

        this.calendar = new Calendar({ date: this.options.value });

        this.calendar.on('mousedown', () => {
            this.calendarMouseDown = true;
            this._preventFocusLost();
        });

        this.calendar.on('mouseup', () => {
            this.calendarMouseDown = false;
            this._preventFocusLost();
        });

        this.calendar.renderables.calendarHeader.on('mouseout', () => {
            if (this.calendarMouseDown) {
                this.blurIntercept = true;
                this.calendarMouseDown = false;
                this._preventNextInputBlur();
            }
        });

    }

    _preventFocusLost() {
        this.renderables.calendarInputField.focus();
        this.blurIntercept = true;

        this._preventNextInputBlur();
    }

    _preventNextInputBlur() {
        /* Simulating "once" behaviour */

        let blurHandler = () => {
            this.renderables.calendarInputField.focus();
            this.renderables.calendarInputField.removeListener('blur', blurHandler);
        };

        this.renderables.calendarInputField._eventOutput.listeners['blur'][1] = blurHandler;
    }

    _showItemWithKey(key, callback) {
        this.renderables[key].halt();
        this.renderables[key].show(this[key], undefined, callback);
    }

    _hideItemWithKey(key, callback) {
        this.renderables[key].halt();
        this.renderables[key].hide(undefined, callback);
    }

    _onBlur() {
        if (!this.blurIntercept) {
            setTimeout(() => {
                if (!this.blurIntercept) {
                    if (this._showingCalendar) {
                        this._setCalendarVisible(false);
                        this._clickIntercept = true;
                    }
                } else {
                    this.blurIntercept = false;
                }
            }, 10);
        } else {
            this.blurIntercept = false;
        }
    }

    _initMouseBehaviour() {

        this._showingCalendar = false;

        this.renderables.extensionArrow.on('click', () => {
            this._toggleCalendarVisibilty();
        });

    }

    _toggleCalendarVisibilty() {
        if (!this._showingCalendar) {
            this._setCalendarVisible(true);
        } else {

            this._setCalendarVisible(false);
        }
    }

    _setCalendarVisible(show) {
        if (show) {
            this.renderables.extensionArrow.setContent(collapseArrow);
            this._showItemWithKey("calendar", () => {
                this._showingCalendar = true;
                this.renderables.calendarInputField.focus();

                if (this.date) {
                    this.calendar.chooseDate(this.date);
                } else if (this.options.date) {
                    this.calendar.setDate(this.options.date);
                }
            });
        } else {
            this.renderables.extensionArrow.setContent(expandArrow);
            this._hideItemWithKey("calendar", () => {
                this._showingCalendar = false;
            });
        }
    }

    getTime() {
        return this.date ? this.date.getTime() : null;
    }

    setDate(date) {
        this.setValue(date);
    }

    _onFieldChange(value) {
        let parsedDate = new moment(value, this.options.dateFormat, true);
        if (parsedDate.isValid()) {
            this.date = parsedDate.toDate();
            if (this._showingCalendar) {
                this.calendar.chooseDate(this.date);
            }
        } else {
            this._eventOutput.emit('valueChange', value);
            this.date = null;
        }
    }

    setValue(value = null) {
        this.renderables.calendarInputField.setValue(value);
        let parsedDate = new moment(value, this.options.dateFormat, true);
        this.date = parsedDate.isValid() ? new Date(value) : null;
    }

    setDate(date) {
        this.renderables.calendarInputField.setValue(moment(date).format(this.options.dateFormat));
        this.date = date;
        this.calendar.chooseDate(date);
    }


    getDate() {
        return this.date;
    }

    _formatDate(date) {
        return date ? new moment(date).format(this.options.dateFormat) : '';
    }


    getValue() {
        return this.renderables.calendarInputField.getValue();
    }

    getSize() {
        return [undefined, undefined];
    }
}