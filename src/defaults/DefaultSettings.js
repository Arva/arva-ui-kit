/**
 * Created by vlad on 25/07/16.
 */

export let Settings = {
};

export function setSettings(settings) {
    for(let property in settings) {
        Settings[property] = settings[property];
    }
}