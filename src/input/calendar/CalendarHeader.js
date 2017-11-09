/**
 * Created by lundfall on 11/24/15.
 */

import moment                       from 'moment';
import _                            from 'lodash';
import {Surface}                    from 'arva-js/surfaces/Surface.js';
import {View}                       from 'arva-js/core/View';
import AnimationController          from 'famous-flex/AnimationController.js';
import InputSurface                 from 'famous/surfaces/InputSurface';
import ContainerSurface             from 'famous/surfaces/ContainerSurface.js';
import BkImageSurface               from 'famous-bkimagesurface/BkImageSurface.js';
import FlexScrollView               from 'famous-flex/FlexScrollView';
import LayoutController             from 'famous-flex/LayoutController';
import ListLayout                   from 'famous-flex/layouts/ListLayout';
import WheelLayout                  from 'famous-flex/layouts/WheelLayout';
import FamousDatePicker             from 'famous-flex/widgets/DatePicker.js';

import {Text as ReadOnlyText}       from '../../text/Text.js';
import rightArrow                   from './right_arrow.svg!arva-js/utils/ImageLoader.js';
import leftArrow                    from './left_arrow.svg!arva-js/utils/ImageLoader.js';

import {DatePicker}                 from './DatePicker.js';


const DEFAULT_OPTIONS = {
    dateFormat: "dd/mm/yy",
    extensionButtonImageUrl: 'img/expand_arrow.svg',
    inactiveDayColor: 'rgb(200,200,200)',
    date: new Date(),
    height: 30,
    margins: [3, 3, 3, 0]

};

export class CalendarHeader extends View {
    constructor(options) {

        options = _.merge(options, DEFAULT_OPTIONS);
        super(options);

        this.name = options.name;
        this.options = options;

        let monthPicker = new DatePicker({
            formatString: "MMMM",
            datePickerComponent: FamousDatePicker.Component.Month,
            itemProperties: {'text-align': 'left'},
            date: this.options.date
        });

        let yearPicker = new DatePicker({
            formatString: "YYYY",
            datePickerComponent: FamousDatePicker.Component.Year,
            itemProperties: {'text-align': 'right'},
            date: this.options.date
        });

        this.month = moment(this.options.date).month();
        this.year = moment(this.options.date).year();

        monthPicker.renderables.datePicker.on('scrollend', (event) => {
            this.month = moment(event.date).month();
            this._onNewMonthAndYear();
        });

        yearPicker.renderables.datePicker.on('scrollend', (event) => {
            this.year = moment(event.date).year();
            this._onNewMonthAndYear();
        });

        this.renderables.month = monthPicker;
        this.renderables.year = yearPicker;


        this.renderables.background = new Surface({
            properties: {
                backgroundColor: 'white',
                borderRadius: '1px'
            }
        });

        this.renderables.leftArrow = new BkImageSurface({
            content: leftArrow,
            sizeMode: '50% 50%',
            positionMode: BkImageSurface.PositionMode.CENTER,
            properties: {
                cursor: 'pointer'
            }
        });

        this.renderables.rightArrow = new BkImageSurface({
            content: rightArrow,
            sizeMode: '50% 50%',
            positionMode: BkImageSurface.PositionMode.CENTER,
            properties: {
                cursor: 'pointer'
            }
        });

        this.renderables.leftArrow.on('click', () => {
            this.incrementMonth(-1);
        });

        this.renderables.rightArrow.on('click', () => {
            this.incrementMonth(1);
        });


        this.layouts.push((context) => {


            context.set('month', {
                size: [2 * context.size[0] / 5, undefined],
                origin: [0, 0.5],
                align: [0, 0.5],
                translate: [this.options.margins[0], 0, 10]
            });

            context.set('background', {
                size: [undefined, undefined],
                origin: [0, 0],
                align: [0, 0],
                translate: [0, 0, 5]
            });

            context.set('leftArrow', {
                size: [20,20],
                origin: [0.5, 0.5],
                align: [0.5,0.5],
                translate: [-10,0,10]
            });

            context.set('rightArrow', {
                size: [20,20],
                origin: [0.5, 0.5],
                align: [0.5,0.5],
                translate: [10,0,10]
            });

            context.set('year', {
                size: [context.size[0] / 3, undefined],
                origin: [1, 0.5],
                align: [1, 0.5],
                translate: [-this.options.margins[2], 0, 10]
            });

        });

    }

    incrementMonth(monthDiff) {
        this.setDate(moment(this.options.date).add(monthDiff, 'months').toDate());
    }

    setDate(newDate) {
        let momentDate = moment(newDate);
        this.month = momentDate.month();
        this.year = momentDate.year();
        this.renderables.month.setDate(newDate);
        this.renderables.year.setDate(newDate);
        this._onNewMonthAndYear();
    }

    _onNewMonthAndYear() {
        this.options.date = moment({year: this.year, month: this.month}).toDate();
        if (this.options.onNewMonthAndYear) {
            this.options.onNewMonthAndYear(this.month, this.year);
        }
    }

}