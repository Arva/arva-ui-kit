import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/account_rounded_bold.txt';
        
        export class AccountIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }