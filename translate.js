export async function translateToEnglish(text) {
    try {
        const res = await fetch(
            process.env.TRANSLATE_API
        );

        const data = await res.json();

        return data[0][0][0];
    } catch (err) {
        console.log(err);
        return text;
    }
}
