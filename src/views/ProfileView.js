/**
 * Created by Manuel on 20/10/2016.
 */

import {Surface}        from 'arva-js/surfaces/Surface.js';

import {View}                       from 'arva-js/core/View.js';
import {layout, flow}               from 'arva-js/layout/Decorators.js';
import {combineOptions}             from 'arva-js/utils/CombineOptions.js';
import {UIRegular}                  from '../text/UIRegular.js';
import {LoadingPlaceholderProfile}  from '../placeholders/LoadingPlaceholderProfile.js';
import {UITitle}                    from '../text/UITitle.js';
import {Colors}                     from '../defaults/DefaultColors.js';
import {FloatingImageButton}        from '../buttons/FloatingImageButton.js';

@layout.columnDockPadding(720, [32, 32, 32, 32])
@layout.flow()
export class ProfileView extends View {

    @layout.fullSize()
    @layout.translate(0, 0, -10)
    background = new Surface({properties: {backgroundColor: 'white'}});

    @layout.dock.top(160)
    @layout.stick.center()
    @layout.dockSpace(32)
    @layout.size(160, 160)
    @layout.translate(0, 0, 10)
    image = new LoadingPlaceholderProfile({content: this.options.imageURL});

    @layout.dock.top(~32)
    @layout.dockSpace(32)
    @layout.size(~100, ~32)
    @layout.translate(0, 0, 10)
    @layout.stick.center()
    name = new UITitle({content: this.options.title});

    @layout.dock.top(~32)
    @layout.dockSpace(8)
    @layout.size(~100, ~32)
    @layout.translate(0, 0, 10)
    @layout.stick.center()
    subTitle = new UIRegular({content: this.options.subTitle, properties: {color: Colors.ModestTextColor}});

    @layout.dock.top(~32)
    @layout.dockSpace(8)
    @layout.size(~100, ~32)
    @layout.translate(0, 0, 10)
    @layout.stick.center()
    buttons = new ButtonsView();

    @layout.dock.top(2)
    @layout.dockSpace(32)
    @layout.translate(0, 0, 10)
    @layout.stick.center()
    line = new Surface({
        properties: {
            borderBottom: '1px solid rgba(0,0,0,0.1)'
        }
    });

    @layout.dock.top(~320)
    @layout.size(undefined, undefined)
    @layout.dockSpace(32)
    @layout.translate(0, 0, 10)
    description = new UIRegular({content: this.options.description});

    /**
     * ProfileView
     * @param options
     */
    constructor(options = {
        title: '',
        subTitle: '',
        description: ''
    }) {
        super(options);

        this.variation = options.variation || "vertical";

        this.onNewSize(this._setOrientation.bind(this));
    }

    _setOrientation([width]) {
        this.width = width;
        let variation = width <= 560 ? 'vertical' : 'horizontal';
        if (variation != this.variation) {
            this.variation = variation;
            if (variation === 'vertical') {
                this.decorateRenderable('image', layout.dock.top(160), layout.dockSpace(32), layout.stick.center(), layout.translate(0, 0, 10));
                this.decorateRenderable('name', layout.dock.top(~32), layout.dockSpace(32), layout.stick.center(), layout.translate(0, 0, 10));
                this.decorateRenderable('subTitle', layout.dock.top(~32), layout.dockSpace(16), layout.stick.center(), layout.translate(0, 0, 10));
                this.decorateRenderable('buttons', layout.dock.top(~32), layout.dockSpace(8), layout.stick.center(), layout.translate(0, 0, 10));
                this.decorateRenderable('line', layout.dock.top(2), layout.dockSpace(32), layout.stick.center(), layout.translate(0, 0, 10), layout.size(undefined, 2));
                this.decorateRenderable('description', layout.dock.top(~320), layout.dockSpace(32), layout.translate(0, 0, 10), layout.size(undefined, undefined));
            } else {
                this.decorateRenderable('image', layout.dock.left(160), layout.stick.topRight(), layout.translate(32, 0, 10));
                this.decorateRenderable('name', layout.dock.top(~32), layout.dockSpace(16, 0, 0, 32), layout.stick.center(), layout.translate(-80, 22, 10));
                this.decorateRenderable('subTitle', layout.dock.top(~32), layout.dockSpace(16, 0, 0, 32), layout.stick.center(), layout.translate(-80, 16, 10));
                this.decorateRenderable('buttons', layout.dock.top(~32), layout.dockSpace(32, 0, 0, 32), layout.stick.center(), layout.translate(-80, 0, 10));
                this.decorateRenderable('line', layout.dock.none(), layout.translate(0, 210, 10), layout.size((size)=>Math.min(656, size - 64), 2), layout.align(0.5, 0), layout.origin(0.5, 0));
                this.decorateRenderable('description', layout.dock.none(), layout.translate(0, 242, 10), layout.size((size)=>Math.min(656, size - 64), ~320), layout.align(0.5, 0), layout.origin(0.5, 0));
            }
        }
    }

    setDescription(content = '') {
        this.description.setContent(content);
    }
}

export class ButtonsView extends View {
    constructor(options = {
        buttons: []
    }) {
        super(options);

        for (let index in options.buttons) {
            this.addRenderable(new FloatingImageButton(options.buttons[index]), `button${index}`, layout.dock.left(64), layout.size(48, 48), layout.translate(0, 0, 10), layout.dockSpace(8))
        }

    }
}