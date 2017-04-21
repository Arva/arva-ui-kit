/**
 * Created by lundfall on 12/17/15.
 */
import moment                               from 'moment';
import _                                    from 'lodash';
import {View}                               from 'arva-js/core/View.js';
import Surface                              from 'famous/core/Surface.js';

import FamousDatePicker                     from 'famous-flex/widgets/DatePicker.js';
import {Text as ReadOnlyText}               from '../../text/Text.js';


export class DatePicker extends View {

    static get DEFUALT_OPTIONS() {
        return {};
    }


    constructor(options = {}) {
        options = _.defaults({},options, FamousDatePicker.DEFAULT_OPTIONS);
        super(options);
        this.options = options;



        let datePicker = new FamousDatePicker({
            date: this.options.date,
            perspective: 500,
            autoPipeEvents: true,

            scrollController: {
                scrollSpring: {
                    scrollSync: { scale: 1 },
                    //paginationEnergyThreshold: 0.0005,
                    dampingRatio: 0.6,
                    period: 400,
                    scrollFriction: {
                        strength: -1
                    }
                }
            },
            createRenderables: {
                item: (id, data)  => {

                    let item = new  ReadOnlyText({
                        content: data,
                        properties: _.extend(this.options.itemProperties,{lineHeight: '200%', paddingTop:4})
                    });
                    item.pipe(this._eventOutput);
                    return item;
                },
                top: false,
                bottom: false
            },
            wheelLayout: {
                itemSize: 40,
                diameter: 45,
                radialOpacity: -0.99
            }
        });

        datePicker.setComponents([
            new this.options.datePickerComponent({
                format:  (date) => {
                    return moment(date).format(this.options.formatString);
                }
            })
        ]);

        this.renderables.overlay = new Surface({});

        this.renderables.overlay.on('mouseout', () => {
            datePicker.scrollWheels[0].scrollController._eventInput.trigger('mouseup', {});
        });

        this.renderables.overlay.on('mouseover', () => {
            datePicker.scrollWheels[0].scrollController._eventInput.trigger('mouseup', {});
        });


        this.renderables.datePicker = datePicker;
        this.renderables.overlay.pipe(this.renderables.datePicker.scrollWheels[0].scrollController._eventInput);



        this.layouts.push((context)=> {
            context.set('datePicker', {
                size: [context.size[0], context.size[1]],
                align: [0, 0],
                origin: [0, 0],
                translate: [0, 3, 0]
            });

            context.set('overlay', {
                size: [context.size[0], context.size[1]*3],
                align: [0, 0],
                origin: [0, 0],
                translate: [0, -context.size[1]*1.5, 10]
            });
        });

    }

    setDate(date) {
        this.renderables.datePicker.setDate(date);
    }
}
