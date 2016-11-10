/**
 * Created by Manuel on 10/11/2016.
 */


export class NotificationServiceHandler {

    /**
     *
     */
    constructor(options = {immediatePermission: false}){
        this.options = options;

        if(!window.FirebasePlugin || !window.cordova){
            console.error('NotificationServiceHandler can only be used when cordova-plugin-firebase is installed');
            return;
        }

        this.firebasePlugin = window.FirebasePlugin;

        this.firebasePlugin.onTokenRefresh(this._handleTokenRefresh, (error)=>{
            console.error(error);
        });

        this.firebasePlugin.onNotificationOpen(this._onNotificationOpen, (error)=> {
            console.error(error);
        });

        if(options.immediatePermission){
            this._askPermission();
        }
    }

    /**
     * IOS only
     * @private
     */
    _askPermission(){
        if(device && device.platform && device.platform === 'iOS'){
            this.firebasePlugin.grantPermission();
        }
    }

    /**
     * Saves a token to a location
     * @private
     */
    _handleTokenRefresh(token = ""){
        // todo save token
        console.log(token);
    }

    /**
     *
     * @param notification
     * @private
     */
    _onNotificationOpen(notification = {}){
        // todo handle notification opens
        console.log(notification);
    }

}