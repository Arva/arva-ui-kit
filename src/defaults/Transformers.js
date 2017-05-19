import Encoder        from 'node-html-encoder';

let HTMLEncoder = new Encoder.Encoder('entity');

export let HTMLTextTransformer = (Text) => {
    return HTMLEncoder.htmlEncode(Text);
};