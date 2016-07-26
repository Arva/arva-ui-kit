/**  * Created by Manuel on 20/07/16.  */
import FamousContext            from 'famous/core/Context.js';
import {View}                   from 'arva-js/core/View.js';
import {Model}                  from 'arva-js/core/Model.js';
import {DataSource}             from 'arva-js/data/DataSource.js';
import {LocalModel}             from 'arva-js/data/local/LocalModel.js';
import {LocalPrioritisedArray}  from 'arva-js/data/local/LocalPrioritisedArray.js';
import {layout}                 from 'arva-js/layout/Decorators.js';
import {Injection}              from 'arva-js/utils/Injection.js';
import {PrioritisedArray}       from 'arva-js/data/PrioritisedArray.js';
import {DataBoundScrollView}    from 'arva-js/components/DataBoundScrollView.js';
import Transform                from 'famous/core/Transform.js';

import {NotificationItem}       from './NotificationItem.js';

export class NotificationManager {
    itemCounter = 1;

    constructor(options = {}) {
        let famousContext = Injection.get(FamousContext);
        let notifications = this.notifications = options.notificationsArray || new LocalPrioritisedArray(LocalModel);
        let notificationWrapper = this.notificationWrapper = new NotificationWrapper({dataSource: notifications, delay: options.delay || 4000});
        famousContext.add(notificationWrapper);

        // todo remove
        window.add = this.add.bind(this);
    }

    /**
     * Add a new notification to display
     * @param data
     */
    add(data = {}) {
        this.notifications.add(new Notification(++this.itemCounter, {
            title: data.title || 'Notification',
            body: data.body || "Lorum Ipsum",
            action: data.action || 'Confirm',
            type: data.type || 'action'
        }));
    }

    _removeItem(id) {
        this.notificationWrapper._removeItem(id);
    }
}

class NotificationWrapper extends View {

    dataSource = [];

    @layout.dock('fill')
    @layout.translate(0, 0, 5000)
    scrollView = new DataBoundScrollView({
        layoutOptions: {
            spacing: 24,
            margins: [16, 16, 16, 16]
        },
        flowOptions: {
            spring: {dampingRatio: 0.8, period: 650},
            insertSpec: {transform: Transform.translate(0, -300, 0), opacity: 0},
            removeSpec: {opacity: 0}
        },
        dataStore: this.options.dataSource,
        sortingDirection: 'descending',
        orderBy: 'id',
        enabled: false,
        mouseMove: false,
        dataFilter: (item) => {

            /* Don't wait for type === auto, render view immediately */
            if (item.type === 'auto') return true;

            /* Special case for the first item and an empty queue, render view immediately */
            if (!this.queue || this.queue.length === 0) {
                this.queue = [];
                this.queue.push(item);
                return true;
            }
            this.queue.push(item);

            /* Wait until the last notification is removed before rendering the view */
            return new Promise((resolve)=> {
                let handleRemove = ()=> {
                    if (item === this.queue[0]) {
                        return resolve(true);
                    }
                };
                this.on('removeItem', handleRemove);
            });
        },
        itemTemplate: (item)=> {
            let notificationItem = new NotificationItem(item, {});
            this.hideEventsListeners(item, notificationItem);
            if (item.type === 'auto') {
                this._autoHide(item, notificationItem);
            }
            return notificationItem;
        }
    });

    constructor(options = {}) {
        super(options);
        this.dataSource = options.dataSource;
    }

    hideEventsListeners(item, renderable) {
        renderable.on('swipeCloseX', ()=> {
            this._removeItem(item);
        });

        renderable.on('close', ()=> {
            this._eventOutput.emit('notificationClose', item);
            this._removeItem(item);
        });
    }

    _autoHide(item, renderable) {
        let timeOut = setTimeout(()=> {
            this._removeItem(item);
        }, this.options.delay || 4000);
        renderable.on('click', ()=> {
            clearTimeout(timeOut);
        });
    }

    /**
     * Cleanup the notifications array and scrollView, and notify any waiting models that the current notification is removed
     * @param item
     * @private
     */
    _removeItem(item) {
        if (item instanceof Notification) {
            item.remove();
            let position = this.dataSource._ids[item.id];
            if (position !== undefined) this.dataSource.remove(position);
        } else if (item instanceof Model) {
            item.remove();
        }

        this.scrollView._removeItem({id: item.id});
        if(this.queue && this.queue.length) this.queue.shift();

        setTimeout(()=> {
            this._eventOutput.emit('removeItem');
        }, 50)
    }
}


class Notification extends LocalModel {
    get title() {}

    get body() {}

    get action() {}

    get type() {}

    _buildFromDataSource() {
    }
}
