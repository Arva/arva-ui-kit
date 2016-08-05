import {View}                   from 'arva-js/core/View.js';
import {layout}                 from 'arva-js/layout/Decorators.js';

import {BaseNotification}       from './BaseNotification.js';

export class NotificationItem extends View {

    constructor(notificationModel = {}, options = {}) {
        super(options);

        this.isTablet = this.options.isTablet || false;
        this.addRenderable(new BaseNotification({
            type: notificationModel.type,
            title: notificationModel.title,
            body: notificationModel.body
        }), 'notification', layout.dock.top( ~92, 0, 50), layout.swipable({
            snapY: (notificationModel.type === 'action' || this.isTablet) ? 1 : 0,
            snapX: (notificationModel.type !== 'action' && this.isTablet) ? 1 : 0,
            xThreshold: [undefined, 150],
            yThreshold: [-150, 0],
            xRange: [0, 300],
            yRange: [-300, 0],
            scale: 0.5,
            transition: {duration: 500}
        }));
    }
}