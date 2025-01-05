import { useContext } from 'react';
import { DataContext } from '../context/datacontext';

const Editor = () => {
    const { langs, words, trans } = useContext(DataContext);

    return (
        //This is just to test that all data is correctly recieved
        <div>
            <h2>Languages</h2>
            <ul>
                {langs.length > 0 ? (
                    langs.map((lang) => (
                        <li key={lang.id}>{lang.language}</li>
                    ))
                ) : (
                    <li>No languages.</li>
                )}
            </ul>

            <h2>Words</h2>
            <ul>
                {words.length > 0 ? (
                    words.map((word) => (
                        <li key={word.id}>{word.word}</li>
                    ))
                ) : (
                    <li>No words.</li>
                )}
            </ul>

            <h2>Translations</h2>
            <ul>
                {trans.length > 0 ? (
                    trans.map((tran) => {
                        //To find the word the word_id and trans_id refers to
                        const word = words.find(w => w.id === tran.word_id);
                        const transWord = words.find(w => w.id === tran.trans_id);
                        return (
                            <li key={tran.id}>
                                {word.word} = {transWord.word}
                            </li>
                        );
                    })
                ) : (
                    <li>No translations.</li>
                )}
            </ul>
        </div>
    );
};

export default Editor;