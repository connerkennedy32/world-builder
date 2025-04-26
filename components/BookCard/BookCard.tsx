'use client'
import { useState, useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Card from '@mui/material/Card';
import Input from '@mui/material/Input';
import CardActionArea from '@mui/material/CardActionArea';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Styles from './styles.module.css'
import useGetWordCount from '@/hooks/useGetWordCount';
import useCreateNewWordEntry from '@/hooks/useCreateNewWordEntry';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import CircularProgress from '@mui/material/CircularProgress';
import { Book, WordEntry } from '@prisma/client';
import { useSidebar } from '../ui/sidebar';
import { useRouter } from 'next/navigation';
import { GlobalContext } from '../GlobalContextProvider';
import useCreateNewTimeEntry from '@/hooks/useCreateNewTimeEntry';
import { toast } from '@/hooks/use-toast';
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 20,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: '#51ffdf',
    },
}));

const calculatePercentage = (currentWordCount: number, goalWordCount: number | null) => {
    if (goalWordCount === null) return 0;
    return Math.floor(100 * (currentWordCount / goalWordCount));
}


export default function BookCard({ book }: { book: Book }) {
    const { id, title, goalWordCount, author } = book;
    const { state: sidebarState } = useSidebar();
    const { data: wordCountList = [], isLoading } = useGetWordCount(id);
    const [currentWordCount, setCurrentWordCount] = useState<number>(0);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [wordCount, setWordCount] = useState<number | null>(currentWordCount);
    const [showCheckmark, setShowCheckmark] = useState<boolean>(false);
    const { mutate: createNewWordEntry, isLoading: isCreatingWordEntry } = useCreateNewWordEntry();
    const { mutate: createNewTimeEntry } = useCreateNewTimeEntry();
    const router = useRouter();

    const {
        minutes,
        isRunning,
    } = useContext(GlobalContext);

    const handleCardClick = () => {
        router.push(`/tracker/${id}`);
    }

    const handleAddTimeToBook = () => {
        createNewTimeEntry({ bookId: id, minutes: minutes }, {
            onSuccess: () => {
                toast({
                    title: 'Time added to tracker',
                    description: 'You can now see your time in the tracker',
                });
            }
        });
    }

    const handleEditClick = (event: any) => {
        event.stopPropagation();
        setIsVisible(!isVisible);
    };

    useEffect(() => {
        if (!isLoading && wordCountList.length > 0) {
            setCurrentWordCount(wordCountList[0].wordCount);
        }
    }, [wordCountList, isLoading]);

    const textPercentage = calculatePercentage(currentWordCount, goalWordCount);
    const percentage = Math.min(textPercentage, 100);

    const handleSubmit = () => {
        createNewWordEntry(
            { bookId: id, date, wordCount: wordCount || 0 },
            {
                onSuccess: () => {
                    setShowCheckmark(true);
                    setTimeout(() => setShowCheckmark(false), 1000);
                }
            }
        );
    };

    return (
        <>
            <div className={sidebarState === "expanded" ? Styles.containerDrawerOpen : Styles.containerDrawerClosed}>
                <Card className={Styles.content} variant="outlined">
                    <CardActionArea disableRipple onClick={handleCardClick}>
                        <div style={{ margin: '1em' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>{title}</span>
                                <EditIcon className={Styles.editButton} onClick={handleEditClick} />
                            </div>
                            <span style={{ fontSize: '0.75em', fontStyle: 'italic' }}>{author || 'N/A'}</span>
                            <div style={{ display: 'flex', gap: '0.5em', marginTop: '0.5em', alignItems: 'center' }}>
                                <BorderLinearProgress style={{ width: '100%' }} variant="determinate" value={isLoading ? 0 : percentage} />
                                <span>{`${isLoading ? 0 : textPercentage}%`}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5em' }}>
                                <span style={{ fontSize: '0.75em', fontStyle: 'italic' }}>{`${currentWordCount} / ${goalWordCount}`}</span>
                            </div>
                        </div>
                    </CardActionArea>
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: isVisible ? 'auto' : 0, opacity: isVisible ? 1 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ margin: '1em', display: 'flex', gap: '1em' }}>
                            <Input
                                type="date"
                                placeholder="Date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                inputProps={{
                                    'aria-label': 'Date',
                                }}
                            />
                            <Input
                                type="number"
                                placeholder="Word Count"
                                value={wordCount === null ? '' : wordCount}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setWordCount(value === '' ? null : Number(value));
                                }}
                                inputProps={{
                                    'aria-label': 'Word Count',
                                }}
                            />
                            <Button
                                disabled={wordCount === null || date === '' || isCreatingWordEntry}
                                onClick={handleSubmit}
                            >
                                {isCreatingWordEntry ? <CircularProgress size={24} color="inherit" /> :
                                    showCheckmark ? <CheckCircleIcon /> : 'Submit'}
                            </Button>
                        </div>
                        <div style={{ margin: '1em' }}>
                            {!isRunning && minutes > 0 && <Button onClick={handleAddTimeToBook}>
                                {`Add ${minutes} minute${minutes > 1 ? 's' : ''} to tracker`}
                            </Button>}
                        </div>
                    </motion.div>
                </Card>
            </div>
        </>
    );
}
