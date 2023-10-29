import google from '~/libs/translate/google';

const handleTranslate = async (text) => {
    const sourceLang = (await google.detect({ text })) || 'en';
    const res = await google.translate({
        text,
        from: sourceLang,
        to: 'vi',
    });
    console.log(res);
    return res;
};

export default handleTranslate;
