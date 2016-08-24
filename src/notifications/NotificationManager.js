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
        let notificationWrapper = this.notificationWrapper = new NotificationWrapper({
            dataSource: notifications,
            delay: options.delay || 6000
        });
        famousContext.add(notificationWrapper);
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
    @layout.dock.right(function (width) {
        this.isTablet = width >= 480;
        this.scrollView.setOptions({
            flowOptions: {
                spring: {dampingRatio: 0.8, period: 650},
                insertSpec: {
                    transform: Transform.translate(this.isTablet ? 300 : 0, this.isTablet ? 0 : -300, 50),
                    opacity: 0
                },
                removeSpec: {
                    transform: Transform.translate(this.isTablet ? 300 : 0, this.isTablet ? 0 : -300, -5000),
                    opacity: 0
                }
            }
        });
        return Math.min(width, 384)
    }, 0, 6000)
    @layout.translate(0, 16, 6000)
    scrollView = new DataBoundScrollView({
        layoutOptions: {
            spacing: 16,
            margins: [0, 16, 16, 16]
        },
        dataStore: this.options.dataSource,
        sortingDirection: 'descending',
        orderBy: 'id',
        enabled: false,
        mouseMove: false,
        dataFilter: (item) => {
            if (this.options.multipleNotifications) return true;

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
            let notificationItem = new NotificationItem(item, {
                isTablet: this.isTablet
            });
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

        renderable.on('swiped', (event)=> {
            if (event.direction === 0 && event.displacement === 'right') {
                this._removeItem(item);
            }
        });

        renderable.on('close', ()=> {
            this._eventOutput.emit('notificationClose', item);
            this._removeItem(item);
        });
    }

    _autoHide(item, renderable) {
        let timeOut = setTimeout(()=> {
            this._removeItem(item);
        }, this.options.delay || 6000);
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
        if (this.queue && this.queue.length) this.queue.shift();

        setTimeout(()=> {
            this._eventOutput.emit('removeItem');
        }, 650)
    }
}


class Notification extends LocalModel {
    get title() {}

    get body() {}

    get action() {}

    get type() {}

    _buildFromDataSource() {}
}
