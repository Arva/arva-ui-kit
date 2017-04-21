/**
 * Created by lundfall on 12/18/15.
 */
import _                            from 'lodash';
import {View}                       from 'arva-js/core/View.js';
import Surface                      from 'famous/core/Surface.js';
import LayoutController             from 'famous-flex/LayoutController';
import ListLayout                   from 'famous-flex/layouts/ListLayout';


import {DayPicker}                  from './DayPicker.js';
import {CalendarHeader}             from './CalendarHeader.js';

export class Calendar extends View {

    static get DEFAULT_OPTIONS() {
        return {
            headerHeight: 30,
            backgroundColor: 'rgba(128, 128, 128, 0.9)',
            margins: [5,5,5,5],
            headerSpace: 5
        };
    }

    constructor(options = {}) {
        options = _.merge(Calendar.DEFAULT_OPTIONS, options);
        super(options);
        this.options = options;


        this.renderables.dayPicker = new DayPicker({date: this.options.date});

        this.renderables.calendarHeader = new CalendarHeader({
            height: this.options.headerHeight,
            date: this.options.date,
            onNewMonthAndYear: (month, year) => this.renderables.dayPicker.setMonthAndYear(month, year)
        });

        this.renderables.background = new Surface({
            properties: {
                backgroundColor: this.options.backgroundColor,
                borderRadius: '2px'
            }
        });

        this.renderables.dayPicker.on('datePicked', (date) => {
            this._eventOutput.emit('datePicked', date);
        });
        this.renderables.dayPicker.on('monthChange', (date) => {
            this.renderables.calendarHeader.setDate(date);
        });

        this.layouts.push((context)=> {

            let {margins} = this.options;

            let innerWidth = context.size[0] - (margins[0] + margins[2]);
            let innerHeight = context.size[1] - (margins[1] + margins[3]);


            context.set('calendarHeader', {
                size: [innerWidth, this.options.headerHeight],
                align: [0, 0],
                origin: [0, 0],
                translate: [margins[0], margins[3], 10]
            });

            let yOffset = this.options.headerHeight + this.options.headerSpace;

            context.set('dayPicker', {
                size: [innerWidth, innerHeight - yOffset],
                align: [0, 0],
                origin: [0, 0],
                translate: [margins[0], yOffset, 10]
            });

            context.set('background', {
                size: [context.size[0], context.size[1]],
                align: [0, 0],
                origin: [0, 0],
                translate: [0, 0, 5]
            });
        });
    }

    chooseDate(date){
        this.renderables.dayPicker.chooseDate(date);
        this.renderables.calendarHeader.setDate(date);
    }

    setDate(date){
        this.renderables.dayPicker.setDate(date);
        this.renderables.calendarHeader.setDate(date);
    }
}
