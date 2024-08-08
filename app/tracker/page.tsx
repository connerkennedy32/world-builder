'use client'
import * as React from 'react';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import EditIcon from '@mui/icons-material/Edit';
import Styles from './styles.module.css'

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

const handleCardClick = () => {
    console.log("CLICKING NOW")
}

const handleEditClick = (event: any) => {
    event.stopPropagation();
    console.log('Button clicked');
};

const currentWordCount = 19000;
const goalWordCount = 88000;
const percentage = Math.floor(100 * (currentWordCount / goalWordCount));

export default function CustomizedProgressBars() {
    return (
        <>
            <Card style={{ margin: '1em' }} variant="outlined">
                <CardActionArea disableRipple onClick={handleCardClick}>
                    <div style={{ margin: '1em' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>Lunar Tides</span>
                            <EditIcon className={Styles.editButton} onClick={handleEditClick} />
                        </div>
                        <span style={{ fontSize: '0.75em', fontStyle: 'italic' }}>Conner Kennedy</span>
                        <div style={{ display: 'flex', gap: '0.5em', marginTop: '0.5em', alignItems: 'center' }}>
                            <BorderLinearProgress style={{ width: '300px' }} variant="determinate" value={percentage} />
                            <span>{`${percentage}%`}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5em' }}>
                            <span style={{ fontSize: '0.75em', fontStyle: 'italic' }}>{`${currentWordCount} / ${goalWordCount}`}</span>
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
            </Card>
        </>
    );
}
