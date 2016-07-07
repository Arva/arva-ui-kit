import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/tabs2_angular_bold.txt';
        
        export class Tabs2Icon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }