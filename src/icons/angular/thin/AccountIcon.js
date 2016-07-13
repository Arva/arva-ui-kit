import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/account_angular_thin.svg.txt!text';
        
        export class AccountIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }