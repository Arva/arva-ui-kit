import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/download_rounded_bold.svg.txt!text';
        
        export class DownloadIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }