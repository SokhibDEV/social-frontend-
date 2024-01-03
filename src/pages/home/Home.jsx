import React from 'react';
import './home.scss';
import { Stories } from '../../components';
import { Posts } from '../../components';
import { Share } from '../../components';
export const Home = () => {
    return (
        <div className='home'>
            <Stories/>
            <Share/>
            <Posts/>
        </div>
    );
};

