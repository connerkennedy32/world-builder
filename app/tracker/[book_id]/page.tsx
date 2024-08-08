'use client'
import * as React from 'react';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import EditIcon from '@mui/icons-material/Edit';
import Styles from './styles.module.css'
import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

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

const dataset = [
    {
        words: 10000,
        month: 'January',
    },
    {
        words: 15000,
        month: 'February',
    },
    {
        words: 18000,
        month: 'March',
    },
    {
        words: 21000,
        month: 'April',
    },
    {
        words: 25000,
        month: 'May',
    },
    {
        words: 29000,
        month: 'June',
    },
    {
        words: 32000,
        month: 'July',
    },
    {
        words: 40000,
        month: 'August',
    },
    {
        words: 43000,
        month: 'September',
    },
    {
        words: 46000,
        month: 'October',
    },
    {
        words: 49000,
        month: 'November',
    },
    {
        words: 52000,
        month: 'December',
    },
];

const valueFormatter = (value: number | null) => `${value?.toLocaleString('en-US')}`;

const otherSetting = {
    height: 300,
    yAxis: [{ label: 'rainfall (mm)' }],
    grid: { horizontal: true },
    sx: {
        [`& .${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translateX(-10px)',
        },
    },
};

const currentWordCount = 19000;
const goalWordCount = 88000;
const percentage = Math.floor(100 * (currentWordCount / goalWordCount));

export default function CustomizedProgressBars() {
    return (
        // width: '100vw' needs to be set if this is a top-level component
        <div style={{ display: 'flex', alignItems: 'center', width: '100vw', justifyContent: 'center' }}>
            <Card style={{ margin: '1em' }} variant="outlined">
                <div style={{ margin: '1em' }}>
                    <h1>Lunar Tides</h1>
                    <h3 style={{ fontStyle: 'italic' }}>Conner Kennedy</h3>
                    <div style={{ display: 'flex', gap: '0.5em', marginTop: '0.5em', alignItems: 'center' }}>
                        <BorderLinearProgress style={{ width: '1100px' }} variant="determinate" value={percentage} />
                        <span>{`${percentage}%`}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5em' }}>
                        <span style={{ fontSize: '0.75em', fontStyle: 'italic' }}>{`${currentWordCount} / ${goalWordCount}`}</span>
                    </div>
                </div>
                <div>
                    <LineChart
                        dataset={dataset}
                        xAxis={[
                            {
                                scaleType: 'band',
                                dataKey: 'month',
                                valueFormatter: (month, context) =>
                                    context.location === 'tick'
                                        ? `${month.slice(0, 3)} \n2024`
                                        : `${month} 2024`,
                            },
                        ]}
                        series={[{ dataKey: 'words', label: 'Word count', valueFormatter }]}
                        {...otherSetting}
                    />
                </div>
            </Card>
        </div>
    );
}
