import React, { useState, useEffect, useRef } from 'react';
import movieData from '../videos.json';
import '../../css/material-kit.css';
import '../../css/video.css';
import { Button, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import $ from 'jquery';
import Popper from 'popper.js';
import Not_found from '../../img/default_img.png'
export default function Video() {
    const [visibleMovies, setVisibleMovies] = useState(12);
    const [isLoading, setIsLoading] = useState(false);
    const [showNoMoreContent, setShowNoMoreContent] = useState(false);

    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        if (!isLoading && scrollTop + clientHeight >= scrollHeight && visibleMovies < movieData.length) {
            setIsLoading(true);
            setTimeout(() => {
                setVisibleMovies(visibleMovies + 6);
                setIsLoading(false);
            }, 2000); // Simulate loading time
        } else if (visibleMovies >= movieData.length) {
            setShowNoMoreContent(true);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [visibleMovies, handleScroll]);
    return (
        <div>

            <div >
                <h1>{movieData.length}</h1>
                <main >
                    {movieData.slice(0, visibleMovies).map((movie, index) => (
                        <div className="movie" key={index}>
                            <img
                                src={movie.image || Not_found}
                                alt="電影海報"
                                className="movie_img set_size"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = { Not_found };
                                }}
                            />
                            <div className="movie-info">
                                <h3>{movie.title}</h3>
                                {/*  <span className={getClassByRate(movie.vote_average)}>$</span> */}
                            </div>
                            <div className="release_date">
                                開播時間: <span>{movie.openDate}</span>
                            </div>
                            <div className="release_date">

                                到期時間: <span>
                                    {(() => {
                                        const currentTime = new Date().getTime();
                                        const expiredDate = new Date(movie.expiredDate).getTime();
                                        const remainingTime = expiredDate - currentTime;

                                        if (remainingTime > 0) {
                                            const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
                                            const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                                            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
                                            return (
                                                <span className='bg-grident-primary'>
                                                    {days}日 {hours}小時 {minutes}分鐘 {seconds}秒
                                                </span>
                                            );
                                        } else {
                                            return "已到期";
                                        }
                                    })()}
                                </span>
                            </div>
                            <div className="overview">
                                <h3>Overview</h3>
                                <p className='normal'>{movie.overview}</p>
                            </div>
                            <p className='normal'>Movie ID: {index + 1}</p>
                            {/* 3. filter the result by openDate and expiredDate , check if openDate is already passed or not exceed the expiredDate */}
                            {(() => {
                                const currentTime = new Date().getTime();
                                const openDate = new Date(movie.openDate).getTime();
                                const expiredDate = new Date(movie.expiredDate).getTime();

                                if (currentTime >= openDate && currentTime <= expiredDate) {
                                    return <div>Available for viewing</div>;
                                } else {
                                    return null;
                                }
                            })()}
                        </div>
                    ))}
                </main>
                {isLoading && <div className="loading">正在加載電影...</div>}
                {showNoMoreContent && <div className="no-more-content">哦，沒有更多內容了</div>}
            </div>
            {/* <Accordion defaultActiveKey="0" flush>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Accordion Item #1</Accordion.Header>
                    <Accordion.Body>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Accordion Item #2</Accordion.Header>
                    <Accordion.Body>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion> */}

        </div>
    );
}