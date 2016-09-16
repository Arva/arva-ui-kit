/**
 * Created by lundfall on 08/09/16.
 */
"use strict";

const fs = require('fs');
const convert = require('xml-js');
const iconDirectory = './src/icons/resources';


for (let fileName of fs.readdirSync(iconDirectory)) {
    if (!fileName.endsWith('.svg')) {
        continue;
    }
    console.log(`Processing fileName: ${fileName}`);
    
    let originalXml = fs.readFileSync(`${iconDirectory}/${fileName}`, 'utf8', {compact: false});
    let iconContents = JSON.parse(convert.xml2json(originalXml));
    adjustIconDataRecursively(fileName, iconContents);
    let xml = convert.json2xml(iconContents, {compact: false, ignoreComment: true, spaces: 3});
    let newFilePath = `${iconDirectory}/${fileName}.txt`;
    fs.writeFileSync(newFilePath, xml);
}

console.log("Processing complete!")

function adjustIconDataRecursively(fileName, node) {

    let attributes = node.attributes, children = node.elements;
    if(node.name === 'svg'){
        node.attributes.width = '100%';
        node.attributes.height = '100%';
    }


    if (attributes) {
        let attributesToRefactor = ['id', 'xlink:href'];
        if (node.name === 'use') {
            attributesToRefactor.push('mask')
        }
        for (let attributeName of attributesToRefactor) {
            let attribute = attributes[attributeName];
            if (attribute) {
                /* Add file name to id to be sure it's unique */
                // attribute[attributeName] = fileName + attribute;
                Object.defineProperty(attributes, attributeName, {value: makeIdUnique(attribute, fileName)});

            }
        }
    }

    for (let child of children || []) {
        adjustIconDataRecursively(fileName, child);
    }
}

function makeIdUnique(currentId, fileName) {
    if (currentId.startsWith("url(")) {
        return `url(${makeIdUnique(currentId.slice(4, -1), fileName)})`
    } else if (currentId.startsWith("#")) {
        return `#${fileName}${currentId.substr(1)}`
    } else {
        return fileName + currentId;
    }

}
