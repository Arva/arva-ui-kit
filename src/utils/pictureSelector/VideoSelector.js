/**
 * Created by Manuel on 22/09/16.
 */
import bowser                       from 'bowser';
import {Router}                     from 'arva-js/core/Router.js';
import {Injection}                  from 'arva-js/utils/Injection.js';
import {combineOptions}             from 'arva-js/utils/CombineOptions.js';
import {FirebaseFileSource}         from 'arva-js/data/storage/FirebaseFileSource.js';
import {MediaSelector}              from './MediaSelector.js'

export class VideoSelectorBase extends MediaSelector {
    getFileOptions() {
        return {
            mimeType: 'video/mp4',
            defaultPath:'videos/',
            acceptType: 'video/*',
        }
    }
}

export const VideoSelector = new VideoSelectorBase();