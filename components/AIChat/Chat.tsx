import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Markdown from 'react-markdown';
import { Textarea } from '../ui/textarea';
import { Skeleton } from '../ui/skeleton';

export default function Chat({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchOpenAIResponse = async (prompt: string) => {
        setResponse('');
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
            <DialogContent >
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-black">AI Thesaurus</DialogTitle>
                    <DialogDescription className="text-black">
                        Input a phrase to generate different variations of it.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <div className="p-2">
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    fetchOpenAIResponse(input);
                                }
                            }}
                            className="w-full text-black h-24 resize-none"
                            rows={2}
                        />
                        <Button className="w-full mt-2" disabled={isLoading} onClick={() => fetchOpenAIResponse(input)}>Generate</Button>
                        {isLoading && <div className="space-y-2 mt-2">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-[300px]" />
                        </div>}
                    </div>
                    <div>
                        <Markdown>{response}</Markdown>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};