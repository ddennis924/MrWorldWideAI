import Head from "next/head";
import { useState } from "react";
import generate from "./api/generate";
import styles from "./index.module.css";

let RESULTS = [];
export default function Home() {
    const [promptInput, setPromptInput] = useState("");
    const [languageInput, setLanguageInput] = useState("n/a");

    function renderResults() {
        return RESULTS.slice(0)
            .reverse()
            .map((res, i) => (
                <div key={i.toString()} className={styles.resultsbox}>
                    <h2>Prompt</h2>
                    <span className={styles.prompt}>{res.prompt}</span>
                    <h2>Response</h2>
                    <div className={styles.english}>
                        <span>{generateEnglish(res.ans, res.lang)}</span>
                    </div>
                    <br></br>
                    <div
                        className={
                            res.lang != "n/a" ? styles.foreign : styles.hidden
                        }
                    >
                        <span>{generateForeign(res.ans, res.lang)}</span>
                    </div>
                </div>
            ));
    }

    function generateEnglish(prompt, lang) {
        const end = prompt.search(lang);
        if (end > -1) {
            return prompt.substring(0, end);
        }
        return prompt;
    }
    function generateForeign(prompt, lang) {
        const start = prompt.search(lang);
        if (start > -1) {
            return prompt.substring(start, prompt.length);
        }
        return "";
    }
    function createResult(p, res, lang) {
        const box = { prompt: p, ans: res, lang: lang };
        RESULTS.push(box);
        console.log(RESULTS);
    }

    async function onSubmit(event) {
        event.preventDefault();
        const lang = languageInput;
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: promptInput,
                language: languageInput,
            }),
        });
        const data = await response.json();
        console.log("done");
        createResult(promptInput, data.result, lang);
        setPromptInput("");
    }
    return (
        <div>
            <Head>
                <title>WorldWideAI</title>
                <link rel="icon" href="/earth.png" />
            </Head>

            <main className={styles.main}>
                <img src="/earth.png" className={styles.icon} />
                <h3>Mr. WorldWide AI</h3>
                <form onSubmit={onSubmit}>
                    <div className={styles.langContainer}>
                        <h4>Choose Language:</h4>
                        <select
                            type="text"
                            name="languages"
                            id="langs"
                            onChange={(e) => setLanguageInput(e.target.value)}
                            className={styles.lang}
                        >
                            <option value="n/a">n/a</option>
                            <option value="French">French</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Spanish">Spanish</option>
                        </select>
                    </div>
                    <input
                        type="text"
                        name="prompt"
                        placeholder="Enter a prompt"
                        value={promptInput}
                        onChange={(e) => setPromptInput(e.target.value)}
                    />
                    <input type="submit" value="Submit" />
                </form>
                <div className={styles.result}>{renderResults()}</div>
            </main>
        </div>
    );
}
