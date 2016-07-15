/**
 * Created by lundfall on 6/1/16.
 */

import {View}                from 'arva-js/core/View.js';
import {layout, options}     from 'arva-js/layout/decorators.js';

import {Text}                from '../../../text/Text.js';

var Settings = {
    smallFontSize: '12px'
};

@layout.margins([3])
export class NameDisplay extends View {

    @layout.dockSpace(3)
    @layout.size(400,~30)
    @layout.dock('bottom')
    lastLogin = new Text({properties:{fontSize: Settings.smallFontSize, textAlign: 'right'}});

    @layout.dockSpace(1)
    @layout.size(400,~30)
    @layout.dock('bottom')
    name = new Text({properties: {textAlign: 'right', fontWeight: 'bold'}});


    updateUser() {
    }

    constructor(options){
        super(options);
        this.updateUser();
    }
}