'use client'
import { useState, useEffect } from 'react';
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
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

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


export default function CustomizedProgressBars() {
    const { data: wordCountList = [], isLoading } = useGetWordCount(1);
    const [currentWordCount, setCurrentWordCount] = useState<number>(0);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [date, setDate] = useState<string>('');
    const [wordCount, setWordCount] = useState<number | null>(currentWordCount);
    const [showCheckmark, setShowCheckmark] = useState<boolean>(false);
    const { mutate: createNewWordEntry, isLoading: isCreatingWordEntry } = useCreateNewWordEntry();

    const handleCardClick = () => {
        console.log("CLICKING NOW")
    }

    const handleEditClick = (event: any) => {
        event.stopPropagation();
        setIsVisible(!isVisible);
    };

    interface WordCount {
        id: number;
        wordCount: number;
        date: string;
    }


    useEffect(() => {
        if (!isLoading && wordCountList.length > 0) {
            const latestWordCount = wordCountList.reduce((prev: WordCount, current: WordCount) =>
                (new Date(prev.date) > new Date(current.date)) ? prev : current
            );
            setCurrentWordCount(latestWordCount.wordCount);
        }
    }, [wordCountList, isLoading]);

    const goalWordCount = 88000;
    const percentage = Math.floor(100 * (currentWordCount / goalWordCount));

    const handleSubmit = () => {
        createNewWordEntry(
            { bookId: 1, date, wordCount: wordCount || 0 },
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
            <div style={{ display: 'flex', alignItems: 'center', width: '100vw', justifyContent: 'center' }}>
                <Card style={{ margin: '2em', width: '50%' }} variant="outlined">
                    <CardActionArea disableRipple onClick={handleCardClick}>
                        <div style={{ margin: '1em' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>Lunar Tides</span>
                                <EditIcon className={Styles.editButton} onClick={handleEditClick} />
                            </div>
                            <span style={{ fontSize: '0.75em', fontStyle: 'italic' }}>Conner Kennedy</span>
                            <div style={{ display: 'flex', gap: '0.5em', marginTop: '0.5em', alignItems: 'center' }}>
                                <BorderLinearProgress style={{ width: '100%' }} variant="determinate" value={isLoading ? 0 : percentage} />
                                <span>{`${isLoading ? 0 : percentage}%`}</span>
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
                                variant="contained"
                                color="primary"
                                disabled={wordCount === null || date === '' || isCreatingWordEntry}
                                onClick={handleSubmit}
                            >
                                {isCreatingWordEntry ? <CircularProgress size={24} color="inherit" /> :
                                    showCheckmark ? <CheckCircleIcon /> : 'Submit'}
                            </Button>
                        </div>
                    </motion.div>
                </Card>
            </div>

            {/* <Card style={{ margin: '1em' }} variant="outlined">
                <CardActionArea onClick={handleCardClick}>
                    <div style={{ margin: '1em' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>Lunar Tides</span>
                            <EditIcon className={Styles.editButton} onClick={handleEditClick} />
                        </div>
                        <span style={{ fontSize: '0.75em', fontStyle: 'italic' }}>Conner Kennedy</span>
                        <div style={{ display: 'flex', gap: '0.5em', marginTop: '0.5em', alignItems: 'center' }}>
                            <BorderLinearProgress style={{ width: '300px' }} variant="determinate" value={85} />
                            <span>85%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5em' }}>
                            <span style={{ fontSize: '0.75em', fontStyle: 'italic' }}>12,000 / 85,000</span>
                        </div>
                    </div>
                </CardActionArea>
            </Card>
            <Card style={{ margin: '1em' }} variant="outlined">
                <CardActionArea onClick={handleCardClick}>
                    <div style={{ margin: '1em' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>Lunar Tides</span>
                            <EditIcon className={Styles.editButton} onClick={handleEditClick} />
                        </div>
                        <span style={{ fontSize: '0.75em', fontStyle: 'italic' }}>Conner Kennedy</span>
                        <div style={{ display: 'flex', gap: '0.5em', marginTop: '0.5em', alignItems: 'center' }}>
                            <BorderLinearProgress style={{ width: '300px' }} variant="determinate" value={15} />
                            <span>85%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5em' }}>
                            <span style={{ fontSize: '0.75em', fontStyle: 'italic' }}>12,000 / 85,000</span>
                        </div>
                    </div>
                </CardActionArea>
            </Card> */}
        </>
    );
}
