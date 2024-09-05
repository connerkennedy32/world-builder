import { useState } from 'react';
import useCreateFolder from '@/hooks/useCreateFolder';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { motion, AnimatePresence } from 'framer-motion';

const CreateFolder = ({ visible, setIsPageIconVisible, isPageIconVisible }: { visible: boolean, setIsPageIconVisible: (isVisible: boolean) => void, isPageIconVisible: boolean }) => {
    const [isInputOpen, setIsInputOpen] = useState(false);
    const [query, setQuery] = useState('');
    const { mutate: createFolder, isSuccess } = useCreateFolder();

    const handleKeyDown = async (event: { key: string; }) => {
        // if (event.key === 'Enter' && query !== '') {
        //     try {
        //         createFolder({ title: query });
        //     } catch (error) {
        //         console.error(error);
        //     }
        // }
    };

    const handleClick = () => {
        setIsInputOpen(!isInputOpen);
        setIsPageIconVisible(!isPageIconVisible);
    }

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <AnimatePresence>
                    {isInputOpen && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 'auto', opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ overflow: 'hidden', marginRight: '0.5rem' }}
                        >
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="New Folder Name"
                                style={{ width: '100%' }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: visible ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleClick}
                    style={{ pointerEvents: visible ? 'auto' : 'none' }}
                >
                    <CreateNewFolderIcon />
                </motion.div>
            </div >
        </>



    )
};

export default CreateFolder;