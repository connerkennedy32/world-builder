'use client'
import { Tree, useSimpleTree } from 'react-arborist';
import { useEffect } from 'react';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

const dataSet = [
    { id: "1", title: "Unread" },
    { id: "2", title: "Threads" },
    { id: "3", title: "Chat Rooms" },
    {
        id: "4",
        title: "Direct Messages",
        children: [
            { id: "d1", title: "Alice" },
            { id: "d2", title: "Bob" },
            { id: "d3", title: "Charlie" },
        ],
    },
];

const apiData = [
    {
        id: "30",
        title: "F1",
        parentId: null,
        order: 0,
        userId: "1",
        content: [
            {
                id: "70",
                content: {
                    type: "doc",
                    content: [
                        {
                            type: "heading",
                            attrs: {
                                level: 1
                            },
                            content: [
                                {
                                    text: "New Page 2",
                                    type: "text"
                                }
                            ]
                        },
                        {
                            type: "paragraph"
                        }
                    ]
                },
                title: "New Page 2",
                parentId: "30",
                userId: "1",
                order: 0
            },
            {
                id: "69",
                content: {
                    type: "doc",
                    content: [
                        {
                            type: "heading",
                            attrs: {
                                level: 1
                            },
                            "content": [
                                {
                                    text: "New Page",
                                    type: "text"
                                }
                            ]
                        },
                        {
                            type: "paragraph"
                        }
                    ]
                },
                title: "New Page",
                parentId: "30",
                userId: "1",
                order: 1
            },
            {
                id: "71",
                content: {
                    type: "doc",
                    content: [
                        {
                            type: "heading",
                            attrs: {
                                level: 1
                            },
                            content: [
                                {
                                    text: "test",
                                    type: "text"
                                }
                            ]
                        },
                        {
                            type: "paragraph"
                        }
                    ]
                },
                title: "test",
                parentId: "30",
                userId: "1",
                order: 2
            }
        ],
    },
    {
        id: "31",
        title: "F6",
        parentId: null,
        order: 1,
        userId: "1",
        pages: [],
        children: [
            {
                id: "32",
                title: "F3",
                parentId: "31",
                order: 1,
                userId: "1",
                children: [
                    {
                        id: "72",
                        content: {
                            type: "doc",
                            content: [
                                {
                                    type: "heading",
                                    attrs: {
                                        level: 1
                                    },
                                    content: [
                                        {
                                            text: "New One",
                                            type: "text"
                                        }
                                    ]
                                },
                                {
                                    type: "paragraph"
                                }
                            ]
                        },
                        title: "NewOne",
                        parentId: "32",
                        userId: "1",
                        order: 0
                    }
                ],
            }
        ]
    },
    {
        id: "33",
        title: "test",
        parentId: null,
        order: 2,
        userId: "1",
        pages: [],
        children: [
            {
                id: "34",
                title: "test2",
                parentId: "33",
                order: 0,
                userId: "1",
                pages: [
                    {
                        id: "73",
                        content: {
                            type: "doc",
                            content: [
                                {
                                    type: "heading",
                                    attrs: {
                                        level: 1
                                    },
                                    content: [
                                        {
                                            text: "Test",
                                            type: "text"
                                        }
                                    ]
                                },
                                {
                                    type: "paragraph"
                                }
                            ]
                        },
                        title: "Test",
                        parentId: "34",
                        userId: "1",
                        order: 0
                    }
                ],
                children: []
            }
        ]
    },
    {
        id: "75",
        content: {
            type: "doc",
            content: [
                {
                    type: "heading",
                    attrs: {
                        level: 1
                    },
                    content: [
                        {
                            text: "test",
                            type: "text"
                        }
                    ]
                },
                {
                    type: "paragraph"
                }
            ]
        },
        title: "test",
        parentId: null,
        userId: "1",
        order: 3
    }
]

// TODO
// Folders should return only children, not pages
// Add search functionality
// Add API call to fetch data
// 

export const FileTree = () => {
    const [data, controller] = useSimpleTree(apiData);

    useEffect(() => {
        console.log("data", data);
    }, [data]);

    return <Tree data={data} {...controller}>{Node}</Tree>;
}

function Node({ node, style, dragHandle }: { node: any; style: any; dragHandle?: any }) {
    /* This node instance can do many things. See the API reference. */
    return (
        <div style={style} ref={dragHandle} onClick={() => node.isLeaf ? null : node.toggle()}>
            {node.isLeaf ? <DescriptionOutlinedIcon /> : <FolderIcon />}
            {node.data.title}
        </div>
    );
}