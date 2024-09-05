import { useState, useEffect } from 'react';
import useCreatePage from '@/hooks/useCreatePage';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { motion, AnimatePresence } from 'framer-motion';

const CreatePage = ({ visible, setIsFolderIconVisible, isFolderIconVisible }: { visible: boolean, setIsFolderIconVisible: (isVisible: boolean) => void, isFolderIconVisible: boolean }) => {
    const [query, setQuery] = useState('');
    const [isInputOpen, setIsInputOpen] = useState(false);
    const { mutate: createPage, isSuccess } = useCreatePage();
    const handleKeyDown = async (event: { key: string; }) => {
        // if (event.key === 'Enter' && query !== '') {
        //     try {
        //         createPage({ title: query });
        //     } catch (error) {
        //         console.error(error);
        //     }
        // }
    };
    useEffect(() => {
        if (isSuccess) {
            setQuery('');
        }
    }, [isSuccess]);

    const handleClick = () => {
        setIsInputOpen(!isInputOpen);
        setIsFolderIconVisible(!isFolderIconVisible);
    }
    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: visible ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleClick}
                    style={{ pointerEvents: visible ? 'auto' : 'none' }}
                >
                    <NoteAddIcon />
                </motion.div>
                <AnimatePresence>
                    {isInputOpen && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 'auto', opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ overflow: 'hidden', marginLeft: '0.5rem' }}
                        >
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="New Page Name"
                                style={{ width: '100%' }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div >
        </>
    )
};

export default CreatePage;