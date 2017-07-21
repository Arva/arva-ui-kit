
/**

     * Created by joe on 2017-03-24.
 * */

import Surface                      from 'famous/core/Surface.js';
import ImageSurface                 from 'famous/surfaces/ImageSurface.js';
import Easing                       from 'famous/transitions/Easing.js';

import {View}                       from 'arva-js/core/View.js';
import {layout, event, flow}        from 'arva-js/layout/Decorators.js';
import {TextH1}                     from 'arva-kit/text/TextH1.js';
import {combineOptions}             from 'arva-js/utils/CombineOptions';

import {LeftIcon}                   from 'arva-kit/icons/LeftIcon.js';
import {CrossIcon}                  from 'arva-kit/icons/CrossIcon.js';
import {RightIcon}                  from 'arva-kit/icons/RightIcon.js';
import {ImageButton}                from 'arva-kit/buttons/ImageButton';
import {TypeFaces}                  from 'arva-kit/defaults/DefaultTypefaces';
import {SingleLineInputSurface}     from 'arva-kit/input/SingleLineInputSurface';
import {LoadingPlaceholderImage}    from 'arva-kit/placeholders/LoadingPlaceholderImage';

import {Cycle}                      from '../Cycle.js';
import {Counter}                    from './Counter.js'

// todo: get rid of this
const buttonSize = 48;

// TODO: move these somewhere more modular

const timingFunctionsMap = {
    inQuad:     "cubic-bezier(0.550,  0.085, 0.680, 0.530)",
    inCubic:    "cubic-bezier(0.550,  0.055, 0.675, 0.190)",
    inQuart:    "cubic-bezier(0.895,  0.030, 0.685, 0.220)",
    inQuint:    "cubic-bezier(0.755,  0.050, 0.855, 0.060)",
    inSine:     "cubic-bezier(0.470,  0.000, 0.745, 0.715)",
    inExpo:     "cubic-bezier(0.950,  0.050, 0.795, 0.035)",
    inCirc:     "cubic-bezier(0.600,  0.040, 0.980, 0.335)",
    inBack:     "cubic-bezier(0.600, -0.280, 0.735, 0.045)",
    outQuad:    "cubic-bezier(0.250,  0.460, 0.450, 0.940)",
    outCubic:   "cubic-bezier(0.215,  0.610, 0.355, 1.000)",
    outQuart:   "cubic-bezier(0.165,  0.840, 0.440, 1.000)",
    outQuint:   "cubic-bezier(0.230,  1.000, 0.320, 1.000)",
    outSine:    "cubic-bezier(0.390,  0.575, 0.565, 1.000)",
    outExpo:    "cubic-bezier(0.190,  1.000, 0.220, 1.000)",
    outCirc:    "cubic-bezier(0.075,  0.820, 0.165, 1.000)",
    outBack:    "cubic-bezier(0.175,  0.885, 0.320, 1.275)",
    inOutQuad:  "cubic-bezier(0.455,  0.030, 0.515, 0.955)",
    inOutCubic: "cubic-bezier(0.645,  0.045, 0.355, 1.000)",
    inOutQuart: "cubic-bezier(0.770,  0.000, 0.175, 1.000)",
    inOutQuint: "cubic-bezier(0.860,  0.000, 0.070, 1.000)",
    inOutSine:  "cubic-bezier(0.445,  0.050, 0.550, 0.950)",
    inOutExpo:  "cubic-bezier(1.000,  0.000, 0.000, 1.000)",
    inOutCirc:  "cubic-bezier(0.785,  0.135, 0.150, 0.860)",
    inOutBack:  "cubic-bezier(0.680, -0.550, 0.265, 1.550)"
};

const defaultAnimationOptions = {
    transition: {
        curve: Easing.outCubic,
        duration: 200
    }
};

const createThemeOptions = function(options) {
    let iconOrImage = !!options.icon || !!options.image;

    let backgroundColor = '#000',
        indicatorColor = '#fff';

    if (options.variation === 'transparent-light') {
        return {
            backgroundProperties: {
                backgroundColor: 'transparent'
            },
            navIconProperties: {
                backgroundColor: 'transparent'
            },
            indicatorDefaultProperties: {
                // if an icon or image, set it's background to the same container background
                backgroundColor: indicatorColor,
            },
            indicatorActiveProperties: {
                backgroundColor: indicatorColor
            },
            indicatorInactiveProperties: {
                backgroundColor: indicatorColor
            },
            decorators: {
                active: {
                    opacity: 1,
                },
                inactive: {
                    opacity: 0.6,
                }
            }
        }
    } else if (options.variation === 'transparent-dark') {
        return {
            backgroundProperties: {
                backgroundColor: 'transparent'
            },
            navIconProperties: {
                backgroundColor: 'transparent'
            },
            indicatorDefaultProperties: {
                backgroundColor,
            },
            indicatorActiveProperties: {},
            indicatorInactiveProperties: {},
            decorators: {
                active: {
                    opacity: 1.0,
                },
                inactive: {
                    opacity: 0.1,
                }
            }
        }
    } else if (options.variation === 'dark') {
        return {
            backgroundProperties: {
                backgroundColor
            },
            navIconProperties: {
                backgroundColor
            },
            indicatorDefaultProperties: {
                backgroundColor: iconOrImage ? backgroundColor : indicatorColor,
                borderColor: iconOrImage ? backgroundColor : indicatorColor,
            },
            indicatorActiveProperties: {},
            indicatorInactiveProperties: {},
            decorators: {
                active: {
                    opacity: 1.0,
                },
                inactive: {
                    opacity: 0.1,
                }
            }
        }
    } else {

        let backgroundColor = "#fff",
            indicatorColor = '#141414';

        return {
            backgroundProperties: {
                backgroundColor
            },
            navIconProperties: {
                backgroundColor
            },
            indicatorDefaultProperties: {
                // if an icon or image, set it's background to the same container background
                backgroundColor: iconOrImage ? backgroundColor : indicatorColor,
                borderColor: iconOrImage ? 'none' : indicatorColor,
            },
            indicatorActiveProperties: {
                backgroundColor: iconOrImage ? backgroundColor : indicatorColor
            },
            indicatorInactiveProperties: {
                backgroundColor: backgroundColor
            },
            decorators: {
                active: {
                    opacity: 1,
                },
                inactive: {
                    opacity: 0.6,
                }
            }
        }
    }
};

export class CarouselIndicators extends View {


    /**
     *
     * @example: basic - default page indicators, default spacing,
     *
     * new Carousel({
     *  numberOfPages: 5
     * })
     *
     * @example: dark theme
     *
     * new Carousel({
     *  numberOfPages: 5,
     *  variation: 'dark'
     * })
     *
     * @example: custom icon, custom animation, custom sizing / spacing
     *
     * new Carousel({
     *  variation: 'dark',
     *  numberOfPages: 5
     *  icon: MyCustomIcon,
     *  decorators: {
     *      active: {
     *          rotate: [0, 0, Math.PI],
     *          scale: [1.25, 1.25, 25]
     *      },
     *      inactive: {
     *          rotate: [0, 0, 0],
     *          scale: [1, 1, 1]
     *      }
     *    },
     *  layout: {
     *      width: 16,
     *      height: 16,
     *      spacing: 24
     *  }
     * })
     *
     * @example: custom image, custom animation timing, overflow to counter
     *
     * new Carousel({
     *   image: MyCustomImage,
     *   numberOfPages: 100
     *   animationOptions: {
     *      transition: Easing.inCubic,
     *      duration: 750
     *   },
     *   overFlowToCounter
     * })
     *
     *
     * @param {Object=} [options.icon] Icon to display
     * @param {Image=} [options.image] Image to display
     * @param {String=} [options.variation] The color variation to display, either 'light' or 'dark'
     * @param {Number=} [options.numberOfPages] Number of icons to render
     * @param {Number=} [options.layout.width] The width of the pageIndicators
     * @param {Number=} [options.layout.height] The height of the pageIndicators
     * @param {Number=} [options.layout.spacing] The spacing between pageIndicators
     * @param {Object=} [decorators.active] key value pairs of layout decorators to display on the currently active pageIndicator
     * @param {Object=} [options.inactive] key value pairs of layout decorators to display on the currently inactive pageIndicators
     * @param {Number=} [options.overflowToCounter] whether to replace the icons with a number indicator if the carousel pageIndicators overflow their container
     */

    @layout.stick.center()
    @layout.fullSize()
    @layout.translate(0, 0, 20)
    backdrop = new Surface({
        properties: this.options.backgroundProperties
    });

    @layout.stick.center()
    @layout.size(undefined, 48)
    pageIndicators = new Cycle(this.options.layout);

    @layout.dock.left(48)
    @layout.size(buttonSize, buttonSize)
    cancel = this.options.showButtons && new ImageButton({
        icon: CrossIcon,
        backgroundProperties: {
            borderRadius: '0px',
            borderWidth: '1px',
            ...this.options.navIconProperties
        }
    });

    @layout.dock.right(48)
    @layout.size(buttonSize, buttonSize)
    nextPage = this.options.showButtons && new ImageButton({
        icon: RightIcon,
        backgroundProperties: {
            borderRadius: '0px',
            borderWidth: '1px',
            ...this.options.navIconProperties
        }
    });

    @layout.dock.right(48)
    @layout.size(48,48)
    prevPage = this.options.showButtons && new ImageButton({
        icon: LeftIcon,
        backgroundProperties: {
            borderRadius: '0px',
            borderWidth: '1px',
            ...this.options.navIconProperties
        }
    });

    constructor(options = {variation: 'light'}) {
        if(!['light', 'dark', 'transparent-light', 'transparent-dark'].includes(options.variation)) { options.variation = 'light'; }
        super(combineOptions({
            numberOfPages: 7,
            layout: {
                width: 8,
                height: 8,
                spacing: 8
            },
            animationOptions: defaultAnimationOptions,
            ...createThemeOptions(options),
            overflowToCounter: true,
            showButtons: true
        }, options));

        this._activeIndex = 0;
        this._properties = this.options.indicatorDefaultProperties;
        this._activeProperties = this.options.indicatorActiveProperties || [];
        this._inactiveProperties = this.options.indicatorInactiveProperties || [];
        this._activeDecorators = this._createDecorators(this.options.decorators.active);
        this._inactiveDecorators = this._createDecorators(this.options.decorators.inactive);

        this._nextButtonEnabled = true;
        this._prevButtonEnabled = true;

        this._setCssTransitions();
        this._createIndicatorsOrCounter();

        if (this.options.showButtons) this._addEventListeners()
    }

    /**
     *
     * @param {Number} The index to move the page indicators or counter to
     */
    setIndex(index) {
        if (index > this.options.numberOfPages -1 || index < 0) return;
        if (this._usesCounter){
            this._setActiveIndex(index);
            this._setCounter(index);
        } else {
            this._changeActiveIndicatorToInactive();
            this._setActiveIndex(index);
            this._changeInactiveIndicatorToActive(index);
        }
    }

    /**
     *
     * @returns {*|number} The current Index
     */
    getIndex(){
        return this._activeIndex;
    }

    enableNextButton(){
        this._nextButtonEnabled = true;
        this.nextPage._setEnabled(true)
    }

    disableNextButton(){
        this._nextButtonEnabled = false;
        this.nextPage._setEnabled(false)
    }

    enablePrevButton(){
        this._prevButtonEnabled = true;
        this.prevPage._setEnabled = true;
    }

    disablePrevButton(){
        this._prevButtonEnabled = false;
        this.prevPage._setEnabled = false;
    }

    /**
     * @param {Number} Set the number of page indicators / counter after initial creation
      */
    resetPageIndicators(number){
        this._setNumberOfPages(number);
        this.pageIndicators.clearRenderables();
        this._createIndicatorsOrCounter();
        this._setActiveIndex(0);
    }

    _setNumberOfPages(number){
        this.options.numberOfPages = number;
    }

    _setActiveIndex(index){
        this._activeIndex = index;
    }

    _addEventListeners(){
        this.nextPage.on('click', (e) => {
            if (!this._nextButtonEnabled) return;
            if (this._activeIndex  === this.options.numberOfPages-1) return;

            this._eventOutput.emit('nextPage', {e:e, activeIndex: this._activeIndex});
            this.setIndex(this._activeIndex + 1)
        });

        this.prevPage.on('click', (e) => {
            if (this._activeIndex  === 0) return;

            this._eventOutput.emit('prevPage', {e:e, activeIndex: this._activeIndex});
            this.setIndex(this._activeIndex - 1)
        });

        this.cancel.on('click', (e) => {
            this._eventOutput.emit('cancel', e)
        })
    }

    _setCssTransitions(){
        let transitionableProps = this._makeTransitionableProperties();

        let timing = this.options.animationOptions.transition.duration;
        let curve = this.options.animationOptions.transition.curve.name;

        let cssCurveName = timingFunctionsMap[curve];

        this._properties.transition = transitionableProps.map( property => {
            return `${property} ${timing/1000}s ${cssCurveName}`
        }).join(', ');
    }

    _createIndicatorsOrCounter(){
        let numberItems = this.options.numberOfPages;
        let itemsAreOverflowing = this._doItemsOverflow();

        if (this.options.overflowToCounter && itemsAreOverflowing){
            let counterObj = this._createCounter();
            this.pageIndicators.setRenderables([counterObj]);
        } else if (!this.options.overflowToCounter || !itemsAreOverflowing) {
            let items = new Array(numberItems).fill(0).map( (val, key) => this._createPageIndicator(key, this.options) );
            this.pageIndicators.setRenderables(items);
        }

        let xTranslation = this.options.showButtons ? -buttonSize / 2 : 0;
        this.decorateRenderable('pageIndicators', layout.translate(xTranslation, 0, 24));
    }

    _createCounter(){
        this._usesCounter = true;
        let counter = new Counter({totalNumber: this.options.numberOfPages, currentNumber: 0});

        return {
            renderable: counter,
            renderableName: 'counter'
        }
    }

    _setCounter(index){
        this.pageIndicators.counter.setCurrentNumber(index+1)
    }

    _changeActiveIndicatorToInactive(index){
        this.pageIndicators[`p${this._activeIndex}`].setOptions({properties: {...this._properties, ...this._inactiveProperties}});
        this.pageIndicators.setRenderableFlowState(`p${this._activeIndex}`, 'inactive');
    }

    _changeInactiveIndicatorToActive(index){
        this.pageIndicators[`p${this._activeIndex}`].setOptions({properties: {...this._properties, ...this._activeProperties}});
        this.pageIndicators.setRenderableFlowState(`p${this._activeIndex}`, 'active');
    }

    _doItemsOverflow(){
        let width = this.options.numberOfPages * this.options.layout.width + (this.options.numberOfPages - 1) * this.options.layout.spacing;
        let size = this.getSize()[0] || window.innerWidth;
        let willOverflow = (width + buttonSize * 3) > size;
        return willOverflow;
    }

    _makeTransitionableProperties(){
        return Object.keys(this._activeProperties)
            .filter( elt => {
                return Object.keys(this._inactiveProperties).includes(elt)
            }).map(elt => {
                let matchCamelCase = elt.match(/[A-Z]/);
                if (matchCamelCase){
                    let eltFirst = elt.substring(0, matchCamelCase.index);
                    let eltLast = elt.substring(matchCamelCase.index).toLowerCase();
                    elt = [eltFirst, eltLast].join('-')
                }
                return elt;
            })
    }

    _createDecorators(decoratorOptions) {
        return Object.entries(decoratorOptions).map(([key, val]) => {
            if (val instanceof Array) {
                return layout[key].apply(null, val)
            }
            return layout[key](val);
        });
    }

    _createPageIndicator(key) {
        let { icon, image, animationOptions } = this.options;
        let renderableType,
            otherOptions = {},
            properties = {
                ...this._properties,
                ...this._inactiveProperties
            };

        if (icon) {
            renderableType = icon;
        } else if (image){
            renderableType = ImageSurface;
            otherOptions = {
                content: image,
            };
            properties = {
                ...this._properties,
                ...this._inactiveProperties
            };
        } else {
            renderableType = Surface;
            properties = {
                ...this._properties,
                ...this._inactiveProperties,
                borderRadius:'50%',
            }
        }

        let renderable = new renderableType({ ...otherOptions, properties});

        return {
            renderable,
            renderableName:`p${key}`,
            decorators: [
                flow.defaultState('inactive', animationOptions, ...this._inactiveDecorators),
                flow.stateStep('active', animationOptions, ...this._activeDecorators)
            ]
        };
    }
}