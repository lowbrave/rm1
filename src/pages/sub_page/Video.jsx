import React, { useState, useEffect } from 'react';
import movieData from '../videos.json';
import '../../css/material-kit.css';
import '../../css/video.css';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import $ from 'jquery';
import Popper from 'popper.js';
import Not_found from '../../img/default_img.png'
import { disableInteractions } from '../../js/disable';
import { ToastContainer, toast } from 'react-toastify';

export default function Video() {
    const [visibleMovies, setVisibleMovies] = useState(12);
    const [isLoading, setIsLoading] = useState(false);
    const [showNoMoreContent, setShowNoMoreContent] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date().getTime());
    const [modalShow, setModalShow] = useState(false);
    const [modalTitle, setModalTitle] = useState(null);
    const [modalBody, setModalBody] = useState(null);

    useEffect(() => {
        disableInteractions();
        const interval = setInterval(() => {
            setCurrentTime(new Date().getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        if (!isLoading && scrollTop + clientHeight >= scrollHeight && visibleMovies < movieData.length) {
            setIsLoading(true);
            setTimeout(() => {
                setVisibleMovies(visibleMovies + 6);
                setIsLoading(false);
            }, 500); // Simulate loading time
        } else if (visibleMovies >= movieData.length) {
            if (window.pageYOffset + window.innerHeight >= document.body.offsetHeight) {
                setShowNoMoreContent(true);
            } else {
                setShowNoMoreContent(false);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [visibleMovies, handleScroll]);

    const findMovieByKey = (key, title, movieData) => {
        return movieData.find((movie) => movie[key] === title);
    };

    const handleMovieBlockClick = (title) => {
        const movie = findMovieByKey("title", title, movieData);
        if (movie) {
            setModalShow(true);
            
            setModalTitle(`${movie.title} 【 全${movie.episodes} 集】`);

            // Create the episode buttons
            let episodeButtons = '<div class="d-flex flex-wrap justify-content-center">';
            for (let i = 1; i <= movie.episodes; i++) {
                const episodeLink = movie.linkTemplate.replace('?EP?', i.toString());
                episodeButtons += `
                <div class="movie_list_item"><a data-href="${episodeLink}"target="_blank"class="custom-btn btn-11"style="border: 1px dotted #3F51B5;color:white">第${i}集<div class="dot"></div></a></div>`;
            }
            episodeButtons += '</div>';
            setModalBody(episodeButtons);
        } else {
            console.error(`No movie found with the title: ${title}`);
        }
    };
    return (
        <div>
            <ToastContainer />
            <Modal
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={modalShow}
                onHide={() => setModalShow(false)}
                style={{
                    color: 'black',
                    display:"grid"
                }}
            >
                <Modal.Header className="d-flec justify-content-center">
                    <Modal.Title id="contained-modal-title-vcenter">
                        { modalTitle }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body dangerouslySetInnerHTML={{ __html: modalBody }}>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setModalShow(false)}>關閉</Button>
                </Modal.Footer>
            </Modal>


            <h1>最近曾觀看(最近五部):</h1>
            {
                movieData.filter((movie) => {
                    const currentTime = new Date().getTime();
                    const openDate = new Date(movie.openDate).getTime();
                    const expiredDate = new Date(movie.expiredDate).getTime();

                    return currentTime >= openDate && currentTime <= expiredDate;
                }).slice(0, visibleMovies).map((movie, index) => {
                    return (
                        <div
                            key={index}
                            className="col movie_list_item"
                            onClick={() => handleMovieBlockClick(movie.title)}
                        >
                            <div className="movie-block">
                                <div className="movie-poster">
                                    <img src={movie.poster} alt={movie.title} />
                                </div>
                                <div className="movie-info">
                                    <h3>{movie.title}</h3>
                                    <p>{movie.description}</p>
                                </div>
                            </div>
                        </div>
                    );
                })
            }
            <h1>精選劇集:</h1>
            <main >
                {movieData.filter((movie) => {
                    const currentTime = new Date().getTime();
                    const openDate = new Date(movie.openDate).getTime();
                    const expiredDate = new Date(movie.expiredDate).getTime();

                    return currentTime >= openDate && currentTime <= expiredDate;
                }).slice(0, visibleMovies).map((movie, index) => (
                    <div className="movie" onClick={() => handleMovieBlockClick(movie.title)} key={index}>
                        <div className="img_container">
                            <img
                                src={movie.image || Not_found}
                                alt="電影海報"
                                className="movie_img set_size"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = { Not_found };
                                }}
                            />
                        </div>
                        <div className="movie-info">
                            <h3>{movie.title}</h3>
                            <span >{movie.episodes} 集</span>
                        </div>
                        <div className="release_date">
                            開播時間: <span>{movie.openDate}</span>
                        </div>
                        <div className="release_date">

                            到期時間: <span>
                                {(() => {
                                    const expiredDate = new Date(movie.expiredDate).getTime();
                                    const remainingTime = expiredDate - currentTime;

                                    if (remainingTime > 0) {
                                        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
                                        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                                        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
                                        return (
                                            <span className='bg-gradient'>
                                                {days}日 {hours}小時 {minutes}分鐘 {seconds}秒
                                            </span>
                                        );
                                    } else {
                                        return "已到期";
                                    }
                                })()}
                            </span>
                        </div>
                        {/* <div className="overview">
                                <h3>Overview</h3>
                                <p className='normal'>{movie.overview}</p>
                            </div> */}
                    </div>
                ))}
            </main>
            {isLoading &&
                <div class="loading">
                    <div class="loading__letter">正</div>
                    <div class="loading__letter">在</div>
                    <div class="loading__letter">加</div>
                    <div class="loading__letter">載</div>
                    <div class="loading__letter">劇</div>
                    <div class="loading__letter">集</div>
                    <div class="loading__letter">.</div>
                    <div class="loading__letter">.</div>
                    <div class="loading__letter">.</div>
                </div>}

            {showNoMoreContent &&
                <div class="loading">
                    <div class="loading__letter">已</div>
                    <div class="loading__letter">展</div>
                    <div class="loading__letter">示</div>
                    <div class="loading__letter">所</div>
                    <div class="loading__letter">有</div>
                    <div class="loading__letter">劇</div>
                    <div class="loading__letter">集</div>
                    <div class="loading__letter">了</div>
                </div>}
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