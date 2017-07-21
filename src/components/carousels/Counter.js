import {View}           from 'arva-js/core/View.js';
import {layout}         from 'arva-js/layout/Decorators.js';

import {UITitle}        from 'arva-kit/text/UITitle.js';
import {Colors}         from 'arva-kit/defaults/DefaultColors.js';

export class Counter extends View {

    /**
     * A Basic Counter component
     */

    @layout.stick.center()
    @layout.size(true, true)
    @layout.translate(-20, 0, 1000)
    currentNumber = new UITitle({
        content: this.options.currentNumber || 0,
        properties: {
            color: Colors.PrimaryUIColor
        }
    });

    @layout.stick.center()
    @layout.size(true,true)
    @layout.translate(0, 0, 1000)
    slash = new UITitle({
        content: '/',
        properties: {
            color: Colors.PrimaryUIColor
        }
    });

    @layout.stick.center()
    @layout.size(true, true)
    @layout.translate(20, 0, 1000)
    totalNumber = new UITitle({
        content: this.options.totalNumber || 0,
        properties: {
            color: Colors.PrimaryUIColor
        }
    });

    /**
     *
     * @param options
     * @param {Number} options.currentNumber - the number to set the counter to
     * @param {Number} options.totalNumber - the number to set the counter total to
     */

    constructor(options={}){
        super(options)
    }

    /**
     *
     * @param {Number} number - number to set the counter's current value to
     */

    setCurrentNumber(number){
        this.currentNumber.setContent(number)
    }

    /**
     *
     * @param {Number} number - number to set the counter's total value to
     */

    setTotalNumber(number){
        this.totalNumber.setContent(number)
    }

}