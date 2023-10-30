const data = localStorage.getItem('data');
const len = 19;
const readVocabularyFile = async (url) => {
    return new Promise((resolve, reject) => {
        try {
            fetch(url)
                .then((res) => res.text())
                .then((data) => {
                    const listWord = data.split('\n');
                    const words = {};
                    for (let j = 0; j < listWord.length - 1; j += 2) {
                        listWord[j] = listWord[j].replace(/\r/g, '');
                        listWord[j + 1] = listWord[j + 1].replace(/\r/g, '');
                        words[listWord[j]] = listWord[j + 1];
                    }
                    resolve(words);
                });
        } catch (err) {
            reject(err);
        }
    });
};

const readJson = async (url) => {
    return new Promise((resolve, reject) => {
        try {
            fetch(url)
                .then((res) => res.text())
                .then((json) => {
                    const obj = JSON.parse(json);
                    resolve(obj);
                });
        } catch (err) {
            reject(err);
        }
    });
};

const getData = async () => {
    // let objWord = [];
    try {
        // if (data && JSON.parse(data).length >= len) {
        //     return JSON.parse(localStorage.getItem('data'));
        // }
        // for (let i = 1; i <= len; i++) {
        // if (data && i <= data.length) {
        //     continue;
        // }
        // const url = `https://raw.githubusercontent.com/ThaiVanHandSome/file-vocabulary/master/vocabularySource/vocabulary_${i}.txt`;
        // }
        const url = 'https://raw.githubusercontent.com/ThaiVanHandSome/file-vocabulary/master/vocabulary.json';
        let objWord = await readJson(url);
        objWord = objWord.slice(0, len);
        localStorage.setItem('data', JSON.stringify(objWord));
        return objWord;
    } catch (err) {
        console.error(`Error while processing data: ${err}`);
        throw err;
    }
};

export default getData;
