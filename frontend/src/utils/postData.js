async function postData(method = "POST", url = "", data = {}) {
    try {
        const response = await fetch(url, {
            method,
            body: JSON.stringify(data),
            headers: new Headers({
                "Content-Type": "application/json",
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`${errorData.err || "Unknown Error"}`);
        }

        return await response.json();
    } catch (error) {
        if (error.name === "AbortError") {
            console.log("Request was aborted");
        } else {
            console.error("Ошибка запроса: ", error);
            throw error;
        }
    }
}

export default postData;
