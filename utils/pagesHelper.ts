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

export const generateTutorialPageContent = () => {
    return {
        type: "doc",
        content: [
            {
                type: "heading",
                attrs: {
                    level: 1
                },
                content: [
                    {
                        text: "Heading 1",
                        type: "text"
                    }
                ]
            },
            {
                type: "heading",
                attrs: {
                    level: 2
                },
                content: [
                    {
                        text: "Heading 2",
                        type: "text"
                    }
                ]
            },
            {
                type: "heading",
                attrs: {
                    level: 3
                },
                content: [
                    {
                        text: "Heading 3",
                        type: "text"
                    }
                ]
            },
            {
                type: "heading",
                attrs: {
                    level: 4
                },
                content: [
                    {
                        text: "Heading 4",
                        type: "text"
                    }
                ]
            },
            {
                type: "paragraph"
            },
            {
                type: "paragraph",
                content: [
                    {
                        text: "#→ Heading 1",
                        type: "text"
                    }
                ]
            },
            {
                type: "paragraph",
                content: [
                    {
                        text: "##→ Heading 2",
                        type: "text"
                    }
                ]
            },
            {
                type: "paragraph",
                content: [
                    {
                        text: "###→ Heading 3",
                        type: "text"
                    }
                ]
            },
            {
                type: "paragraph",
                content: [
                    {
                        text: "####→ Heading 4",
                        type: "text"
                    }
                ]
            }
        ]
    };
}