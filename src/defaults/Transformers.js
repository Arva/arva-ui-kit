import Encoder        from 'node-html-encoder';

let HTMLEncoder = new Encoder.Encoder('entity');

export let HTMLTextTransformer = (Text) => {
    /* Warning: HTMLEncoder will throw an error if (first) argument is not a string. */
    return HTMLEncoder.htmlEncode(""+Text);
};