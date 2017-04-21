/**
 * Created by lundfall on 12/19/15.
 */
import _                            from 'lodash';
import {View}                       from 'arva-js/core/View.js';
import Surface                      from 'famous/core/Surface.js';
import AnimationController          from 'famous-flex/AnimationController.js';
import Easing                       from 'famous/transitions/Easing.js';
import Transform                    from 'famous/core/Transform';

import {Text as ReadOnlyText}       from '../../text/Text.js';
import {Colors}                     from '../../defaults/DefaultColors.js';



export class Day extends View {

    static get DEFAULT_OPTIONS() {
        return {
            backgroundColor: Colors.PrimaryUIColor,
            cursor: 'pointer',
            color : Colors.Black
        };
    }

    constructor(options = {}) {
        options = _.defaults({},options, Day.DEFAULT_OPTIONS);
        super(options);
        this.options = options;

        this.renderables.background = new AnimationController({
            show: {
                transition: {duration: 300, curve: Easing.outBack},
                animation: AnimationController.Animation.Zoom
            }, hide: {
                transition: {duration: 100, curve: 'easeIn'},
                animation: AnimationController.Animation.Zoom
            }
        });


        this.background = new Surface({
            properties: {
                backgroundColor: this.options.backgroundColor,
                borderRadius: '50%'
            }
        });

        this.renderables.text = new ReadOnlyText({
            content: this.options.content,
            properties: {
                fontSize: '10pt',
                textAlign: 'center',
                lineHieght: '10px',
                paddingTop: 4,
                paddingRight: 5,
                color: this.options.color,
                cursor: this.options.cursor
            }
        });


        /* Note that the background changes here in order to have the same width and height */
        this.layouts.push((context)=> {
            let scaleFactor = this.options.content.toString().length > 1 ? 1.15 : 1;
            context.set('background', {
                size: [context.size[1]*scaleFactor, context.size[1]*scaleFactor],
                align: [0.5, 0.5],
                origin: [0.5, 0.5],
                translate: [0,0, 20]
            });

            context.set('text', {
                size: [context.size[0], context.size[1]],
                align: [0, 0],
                origin: [0, 0],
                translate: [0, 0, 25]
            });
        });
    }

    activate() {
        this.renderables.background.show(this.background);
    }

    deactivate(){
        this.renderables.background.hide(this.background);
    }
}
