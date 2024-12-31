import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import Markdown from 'react-markdown';
import CircularProgress from '@mui/material/CircularProgress';

export default function Chat({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchOpenAIResponse = async (prompt: string) => {
        setIsLoading(true);
        const response = await axios.post('/api/openai', { prompt }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        setResponse(response.data);
        setIsLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-full max-h-[80vh] overflow-y-auto">
                <VisuallyHidden.Root>
                    <DialogHeader>
                        <DialogTitle>Hidden</DialogTitle>
                        <DialogDescription>
                            Hidden
                        </DialogDescription>
                    </DialogHeader>
                </VisuallyHidden.Root>
                <div>
                    <div className="p-2">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    fetchOpenAIResponse(input);
                                }
                            }}
                            rows={2}
                            style={{
                                width: '100%',
                                padding: '8px',
                                resize: 'vertical',
                                minHeight: '100px'
                            }}
                        />
                        {isLoading ? <CircularProgress /> : <button className="bg-blue-500 text-white p-2 rounded-md" onClick={() => fetchOpenAIResponse(input)}>Send</button>}
                    </div>
                    <div>
                        <Markdown>{response}</Markdown>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};