/**
 * Created by tom on 16/06/16.
 */

"use strict";

const fs = require('fs');

try { fs.mkdirSync('./src/icons/rounded'); } catch(e){}
try { fs.mkdirSync('./src/icons/rounded/thin'); } catch(e){}
try { fs.mkdirSync('./src/icons/rounded/bold'); } catch(e){}
try { fs.mkdirSync('./src/icons/angular'); } catch(e){}
try { fs.mkdirSync('./src/icons/angular/thin'); } catch(e){}
try { fs.mkdirSync('./src/icons/angular/bold'); } catch(e){}

for(let filePath of fs.readdirSync('./src/icons/resources')){
    if(!filePath.includes('.svg.txt')) { continue; }
    
    let nameComponents = filePath.replace('.svg.txt', '').split('_');
    let icon = nameComponents[0], form = nameComponents[1], thickness = nameComponents[2];

    icon = icon[0].toUpperCase() + icon.substring(1);

    console.log(icon, form, thickness);

    fs.writeFileSync(`./src/icons/${form}/${thickness}/${icon}Icon.js`,
`import {BaseIcon}\t\t\t\t\tfrom '../../BaseIcon.js';
import iconImage\t\t\t\t\tfrom '../../resources/${filePath}!text';

export class ${icon}Icon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}`);
}