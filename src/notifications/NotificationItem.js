import {View}                   from 'arva-js/core/View.js';
import {layout}                 from 'arva-js/layout/Decorators.js';

import {BaseNotification}       from './BaseNotification.js';

export class NotificationItem extends View {

    constructor(notificationModel = {}, options = {}) {

        super(options);

        this.addRenderable(new BaseNotification({
            type: notificationModel.type,
            title: notificationModel.title,
            body: notificationModel.body
        }), 'notification', layout.dock('top', ~92, 0, 50), layout.draggableVelocity({
            snapY: 1,
            snapX: notificationModel.type === 'auto' ? 0 : 1,
            xThreshold: [undefined, 150],
            yThreshold: [undefined, undefined],
            xRange: [0, 300],
            yRange: [0, 0],
            scale: 0.5,
            transition: {duration: 500}
        }));
    }
}