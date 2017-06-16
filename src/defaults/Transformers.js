
let htmlRegexp = new RegExp(/[\<\>]+/g);

export let HTMLTextTransformer = (transformable) => {
    return (transformable + '').replace(htmlRegexp, '')
};
