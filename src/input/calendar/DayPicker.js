/**
 * Created by lundfall on 11/24/15.
 */

import moment                       from 'moment';
import _                            from 'lodash';
import FlexScrollView               from 'famous-flex/FlexScrollView.js';
import CollectionLayout             from 'famous-flex/layouts/CollectionLayout.js';

import {Day}                        from './Day.js';


export class DayPicker extends FlexScrollView {

    static get DEFAULT_OPTIONS() {
        return {
            date: new Date(),
            highlightTextColor: 'rgb(255,255,255)',
            textColor: 'rgb(200,200,200)',
            cursor: 'pointer',
            margins: [7, 3, 3, 3]
        };
    }

    constructor(options = {}) {

        options = _.merge(DayPicker.DEFAULT_OPTIONS, options);
        let daysDisplaying = [];

        super({
                autoPipeEvents: true,
                layout: CollectionLayout,
                layoutOptions: {
                    margins: options.margins,  // outer margins
                    itemSize: (renderNode, contextSize) => [(contextSize[0] - options.margins[1] - options.margins[3] ) / (this.noCols ),
                        (contextSize[1] - options.margins[0] - options.margins[2]) / (this.noRows + 1)]
                },
                flow: true,
                flowOptions: {
                    spring: {               // spring-options used when transitioning between states
                        dampingRatio: 1.5,  // spring damping ratio
                        period: 600         // duration of the animation
                    },
                    insertSpec: {           // render-spec used when inserting renderables
                        opacity: 0          // start opacity is 0, causing a fade-in effect,
                    }
                },
                dataSource: daysDisplaying
            }
        );

        this.weekDayHeader = [];

        for (let day of ['S', 'M', 'T', 'W', 'T', 'F', 'S']) {
            this.weekDayHeader.push(this._createLayoutItem({content: day, cursor: 'default'}));
        }

        this.options = _.merge(options, this.options);

        this.daysDisplaying = this._dataSource.toArray();

        this.chooseDate(this.options.date);
    }

    _getDateNumbers() {
        this.dateNumbers = new Array(7 * 5);

        ///this.lastDayLastMonth = moment({year: this.year, month: this.month, day: 0}).weekday(-1);
        this.startDayThisMonth = moment({year: this.year, month: this.month, day: 0}).day();
        this.noDaysThisMonth = moment({year: this.year, month: this.month, day: 0}).endOf('month').date();
        this.noCols = 7;
        this.noRows = this.startDayThisMonth + this.noDaysThisMonth <= this.noCols * 5 ? 5 : 6;


        this.noDaysLastMonth = moment({
                year: this.year,
                month: this.month,
                day: 0
            }).startOf('month').date(-1).date() + 1;

        let i = 0;

        let monthDifference = -1;

        for (; i < this.startDayThisMonth; i++) {
            let dayNumber = this.noDaysLastMonth + i - (this.startDayThisMonth) + 1;
            this.dateNumbers[i] = {
                monthDifference,
                dayNumber
            };
        }

        monthDifference = 0;

        for (; i < this.startDayThisMonth + this.noDaysThisMonth; i++) {
            let dayNumber = i - (this.startDayThisMonth) + 1;
            this.dateNumbers[i] = {
                dayNumber,
                monthDifference
            };
        }


        monthDifference = 1;

        for (; i < this.noCols * this.noRows; i++) {
            let dayNumber = i - (this.startDayThisMonth + this.noDaysThisMonth) + 1;
            this.dateNumbers[i] = {
                dayNumber,
                monthDifference
            }
        }

        return this.dateNumbers;

    }


    _reArrangeDays() {

        if (!this.daysDisplaying.length) {
            this.dateNumbers = this._getDateNumbers();
            this.daysDisplaying = this.dateNumbers.map(
                ({dayNumber,monthDifference,date}) => {
                    return this._createDayField({dayNumber, monthDifference, date})
                });

            this.setDataSource(this.weekDayHeader.concat(this.daysDisplaying));

        }
        else {
            //Respond to change
            //let oldDateNumbers = this.dateNumbers;
            let oldCurMonthDayCount = this.noDaysThisMonth;
            let oldPrevMonthDayCount = this.noDaysLastMonth;
            let oldStartDay = this.startDayThisMonth;
            let oldNoRows = this.noRows;
            let oldEndingDay = this.noCols * this.noRows - (this.startDayThisMonth + this.noDaysThisMonth);
            let newDateNumbers = this._getDateNumbers();
            let newCurMonthDayCount = this.noDaysThisMonth;
            let newPrevMonthDayCount = this.noDaysLastMonth;
            let newStartDay = this.startDayThisMonth;


            let newNoRows = this.noRows;
            let newEndingDay = this.noCols * this.noRows - (this.startDayThisMonth + this.noDaysThisMonth);



            //Previous month count is the same as the current one if there was nothing to display left of the '1'

            let oldFirstDayPrevMonth = oldPrevMonthDayCount - (oldStartDay) + 1;
            let newFirstDayPrevMonth = newPrevMonthDayCount - (newStartDay) + 1;

            //Todo: this might work but it looks ugly....
            if (oldStartDay == 0) {
                oldPrevMonthDayCount = newPrevMonthDayCount;
                oldFirstDayPrevMonth = oldPrevMonthDayCount - (oldStartDay) + 1;

            }
            if (newStartDay == 0) {
                oldPrevMonthDayCount = newPrevMonthDayCount;
                newFirstDayPrevMonth = newPrevMonthDayCount - (newStartDay) + 1;
                oldFirstDayPrevMonth = oldPrevMonthDayCount - (oldStartDay) + 1;
            }

            if ((oldFirstDayPrevMonth - newFirstDayPrevMonth) * -1 > oldStartDay) {
                this._insertOrRemove({
                    count: -oldStartDay,
                    position: 0
                });

                this._insertOrRemove({
                    count: newStartDay,
                    position: 0,
                    startingDay: newFirstDayPrevMonth,
                    monthDifference: -1
                });

            } else {

                this._insertOrRemove({
                    count: oldFirstDayPrevMonth - newFirstDayPrevMonth,
                    position: 0,
                    startingDay: newFirstDayPrevMonth,
                    monthDifference: -1
                });

                //If the calendar doesn't start at one
                this._insertOrRemove({
                    count: newPrevMonthDayCount - oldPrevMonthDayCount,
                    position: oldFirstDayPrevMonth - newFirstDayPrevMonth + oldStartDay,
                    startingDay: oldPrevMonthDayCount + 1,
                    monthDifference: -1
                });
            }


            this._insertOrRemove({
                count: newCurMonthDayCount - oldCurMonthDayCount,
                position: newStartDay + oldCurMonthDayCount,
                startingDay: oldCurMonthDayCount + 1,
                monthDifference: 0
            });

            this._insertOrRemove({
                count: newEndingDay - oldEndingDay,
                position: newStartDay + newCurMonthDayCount + oldEndingDay,
                startingDay: oldEndingDay + 1,
                monthDifference: 1
            });

            if(this.chosenDayRenderable) {
                if (this.chosenMonth === this.month && this.chosenYear === this.year) {
                    this.chosenDayRenderable.activate();
                } else {
                    this.chosenDayRenderable.deactivate();
                }
            }
        }
    }

    _insertOrRemove({count,position,startingDay,monthDifference}) {
        position += this.weekDayHeader.length;
        if (count > 0) {
            let endingDay = startingDay + count - 1;
            for (let dayNumber = endingDay; dayNumber >= startingDay; dayNumber--) {
                let dayField = this._createDayField({dayNumber, monthDifference});
                if (position == 0) {
                    this.insert(1, dayField);
                    this.swap(0, 1);
                } else {
                    this.insert(position, dayField);
                }
            }
        } else if (count < 0) {
            let noRemovals = -count;
            for (let i = 0; i < noRemovals; i++) {
                this.remove(Math.max(this.weekDayHeader.length, position - i - 1));
            }
        }
    }

    _createLayoutItem({content,color,cursor =  'pointer'}) {
        return new Day({
            content,
            color,
            cursor
        });
    }



    _createDayField({dayNumber,monthDifference}) {
        let dayIsChosen = (dayNumber === (this.chosenDay)    && this.year === this.chosenYear && (this.month + monthDifference + 12)%12 === this.chosenMonth);
        let dayField = this._createLayoutItem({
            content: dayNumber,
            color: monthDifference == 0 ? this.options.highlightTextColor : this.options.textColor
        });

        if(dayIsChosen){
            this.chosenDayRenderable = dayField;
            this.chosenDayRenderable.activate();
        }

        dayField.renderables.text.on('click', () => {

            let clickedDate = moment({
                year: this.year,
                month: this.month
            }).add(monthDifference, 'months').date(dayNumber).toDate();


            if (monthDifference === 0) {
                this._eventOutput.emit('datePicked', clickedDate);
                this.chosenDayRenderable.deactivate();
                this.chosenDayRenderable = dayField;
                this.chosenDayRenderable.activate();
                this.chooseDate(clickedDate, false);
            } else {
                this._eventOutput.emit('monthChange', clickedDate);
            }
        });
        return dayField;
    }

    setDate(date) {
        date = moment(date);
        this.setMonthAndYear(date.month(), date.year());
    }

    chooseDate(date, rearrangeDays = true) {
        let newDate = moment(date);
        let newMonth = newDate.month();
        let newYear = newDate.year();
        let newDay = newDate.date();
        if(newDay === this.chosenDay && newMonth === this.chosenMonth && newYear === this.chosenYear){
            return;
        }
        this.chosenDay = newDay;
        this.chosenMonth = newMonth;
        this.chosenYear = newYear;
        if(this.chosenDayRenderable) {
            this.chosenDayRenderable.deactivate();
            this.chosenDayRenderable = null;
        }
        this.setMonthAndYear(newMonth, newYear, rearrangeDays);
        this.chosenDayRenderable = this._dataSource.findByIndex(this.weekDayHeader.length + this.startDayThisMonth + this.chosenDay - 1)._value;
        this.chosenDayRenderable.activate();
    }

    setMonthAndYear(month, year, rearrangeDays = true) {
        let oldMonth = this.month;
        let oldYear = this.year;
        this.month = month;
        this.year = year;
        if (rearrangeDays && (oldMonth !== this.month || oldYear !== year)) {
            this._reArrangeDays();
        }
    }

}