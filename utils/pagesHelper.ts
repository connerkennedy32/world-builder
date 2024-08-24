export const generateNewPageContent = (title: string) => {
    return {
        type: "doc",
        content: [
            {
                type: "heading", attrs: { level: 1 },
                content: [
                    { text: title, type: "text" }
                ]
            },
            { type: "paragraph" }
        ]
    };
}