import React, { useState, useEffect, useMemo, useRef } from 'react';
import movieData from '../videos.json';
import '../../css/material-kit.css';
import '../../css/video.css';
import { Button, Modal, Carousel, Card, Placeholder } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import $ from 'jquery';
//import Popper from 'popper.js';
import Not_found from '../../img/default_img.png'
import { disableInteractions } from '../../js/disable';
import { ToastContainer, toast } from 'react-toastify';
import 'flag-icon-css/css/flag-icons.min.css';
import Cookies from 'js-cookie';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

export default function Video() {
    const [visibleMovies, setVisibleMovies] = useState(12);
    const [isLoading, setIsLoading] = useState(false);
    const [showNoMoreContent, setShowNoMoreContent] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date().getTime());
    const [modalShow, setModalShow] = useState(false);
    const [modalTitle, setModalTitle] = useState(null);
    const [modalBody, setModalBody] = useState(null);

    const futureMoviesByMonth = useMemo(() => {
        return movieData.reduce((result, movie) => {
            const movieDate = new Date(movie.openDate);
            if (movieDate > new Date()) {
                const monthYear = `${format(movieDate, 'yy年MM月', { locale: zhTW })}`;
                if (!result[monthYear]) {
                    result[monthYear] = [];
                }
                result[monthYear].push(movie);
            }
            return result;
        }, {});
    }, [movieData]);


    useEffect(() => {
        disableInteractions();
        const interval = setInterval(() => {
            setCurrentTime(new Date().getTime());
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let openedWindow;
        let is_clicked = false;
        $(document).on("click touchend", ".movie_list_item", function (event) {
            const childHref = event.target.getAttribute('data-href');
            const childTitle = event.target.getAttribute('data-movie');
            const movie = findMovieByKey("title", childTitle, movieData);
            if (movie && !is_clicked) {
                var get_cookies = Cookies.get('recent_movies')
                if (get_cookies) {
                    var new_cookies = get_cookies + ',' + movie.title;
                    Cookies.set('recent_movies', new_cookies)
                }
                is_clicked = true;
                document.querySelector('html').style.pointerEvents = 'none';
                var message =
                    <div>
                        即將跳轉頁面 <br />劇集：{movie.title} {event.target.text}
                    </div>
                toast.info(message, {
                    autoClose: 1500,
                    onClose: () => {
                        is_clicked = false
                        document.querySelector('html').style.pointerEvents = 'all'
                        var isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
                            navigator.userAgent &&
                            navigator.userAgent.indexOf('CriOS') === -1 &&
                            navigator.userAgent.indexOf('FxiOS') === -1;
                        if (isSafari === true) {
                            if (openedWindow && !openedWindow.closed) {
                                openedWindow.focus();
                                openedWindow.location.href = childHref;
                            } else {
                                openedWindow = window.open(childHref, "_self");
                            }
                        } else {
                            if (openedWindow && !openedWindow.closed) {
                                openedWindow.focus();
                                openedWindow.location.href = childHref;
                            } else {
                                openedWindow = window.open(childHref, '_blank');
                            }
                        }
                    },
                });
            } else {
            }
        });
        function closeAllOpenedWindows() {
            let openedWindows = [];

            // Find all opened windows
            for (let i = 0; i < window.length; i++) {
                const win = window[i];
                if (win && win.open && !win.closed && win !== window.self) {
                    openedWindows.push(win);
                }
            }

            // Close each opened window
            openedWindows.forEach((win) => {
                win.close();
            });
        }
        var count = 0
        document.onvisibilitychange = function () {
            switch (document.visibilityState) {
                case 'hidden':
                    count = count + 1
                    // 使用者不在頁面上時要做的事……
                    break;
                case 'visible':
                    closeAllOpenedWindows();
                    try {
                        if (openedWindow && !openedWindow.closed) {
                            openedWindow.focus();
                            openedWindow.close();
                        }
                    } catch (e) {
                        console.error("Failed to close the window: ", e);
                    }
                    if (count >= 3) {
                        count = 0
                        //window.location.reload();
                    }
                    //window.location.reload();
                    //location.reload();
                    break;
            }
        };

    }, []);


    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        const movie_totla = movieData.filter((movie) => {
            const currentTime = new Date().getTime();
            const openDate = new Date(movie.openDate).getTime();
            const expiredDate = new Date(movie.expiredDate).getTime();

            return currentTime >= openDate && currentTime <= expiredDate;
        })

        if (!isLoading && scrollTop + clientHeight >= scrollHeight && visibleMovies < movie_totla.length) {
            setIsLoading(true);
            setTimeout(() => {
                setVisibleMovies(visibleMovies + 6);
                setIsLoading(false);
            }, 500); // Simulate loading time
        } else if (visibleMovies >= movie_totla.length) {
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
            if (new Date(movie.expiredDate).getTime() < currentTime) {
                var message =
                    <div>
                        劇集 【{movie.title}】已過期
                    </div>
                toast.error(message, {
                    autoClose: 1500
                });
                return
            }
            if (new Date(movie.openDate).getTime() > currentTime) {
                var message =
                    <div>
                        劇集 【{movie.title}】尚未開播
                    </div>
                toast.error(message, {
                    autoClose: 1500
                });
                return
            }
            setModalShow(true);

            setModalTitle(`${movie.title} 【 全${movie.episodes} 集】`);

            // Create the episode buttons
            let episodeButtons = '<div class="d-flex flex-wrap justify-content-center">';
            for (let i = 1; i <= movie.episodes; i++) {
                const episodeLink = movie.linkTemplate.replace('?EP?', i.toString());
                episodeButtons += `
                <div class="movie_list_item"><a data-movie="${movie.title}" data-href="${episodeLink}"target="_blank"class="custom-btn btn-11"style="border: 1px dotted #3F51B5;color:white">第${i}集<div class="dot"></div></a></div>`;
            }
            episodeButtons += '</div>';
            setModalBody(episodeButtons);
        } else {
            var error_msg =
                <div>
                    未找到標題為 {title} 的劇集，請重試
                </div>
            toast.error(error_msg, {
                autoClose: 1500
            });
        }
    };

    const formatOpenDate = (openDateString) => {
        const openDate = new Date(openDateString);
        return `${openDate.getFullYear()}-${String(openDate.getMonth() + 1).padStart(2, '0')}-${String(openDate.getDate()).padStart(2, '0')}`;
    };

    const [index, setIndex] = useState(0);

    const handleCarouselSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <div>
            <ToastContainer
                progressClassName="toastProgress"
                bodyClassName="toastBody"
            />
            <Modal
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={modalShow}
                onHide={() => setModalShow(false)}
                style={{
                    display: "grid"
                }}
            >
                <div style={{ background: "#4f545c" }}>
                    <Modal.Header className="d-flex justify-content-center">
                        <Modal.Title id="contained-modal-title-vcenter" className="font-weight-bolder">
                            {modalTitle}
                        </Modal.Title>
                        <button type="button" class="btn-close text-white" aria-label="Close" onClick={() => setModalShow(false)}></button>
                    </Modal.Header>
                    <Modal.Body dangerouslySetInnerHTML={{ __html: modalBody }}>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => setModalShow(false)}>關閉</Button>
                    </Modal.Footer>
                </div>
            </Modal>
            <h1 className="m-2">精選劇集:</h1>
            {/* <Carousel className="carousel" fade activeIndex={index} onSelect={handleCarouselSelect} interval={4000}>
                {Object.keys(futureMoviesByMonth)
                    .sort()
                    .map((monthYear, index) => (
                        <Carousel.Item className={`catousel_item month-${index + 1}`}>
                            <Card style={{ mixBlendMode: "difference", fontWeight: "1000", textAlign:'center' }}>
                                <div className={`month-background `}>
                                    {monthYear}
                                </div>
                                <Card.Title>即將於 {monthYear}上映的劇集:</Card.Title>
                                <Card.Text>
                                    <ul>
                                        {futureMoviesByMonth[monthYear].map((movie, index) => (
                                            <li style={{ listStyle: "none" }} key={index}>
                                                {movie.title} ({movie.episodes}集)
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Text>
                            </Card>
                        </Carousel.Item>
                    ))}
            </Carousel> */}
            <main >
                {movieData.filter((movie) => {
                    const openDate = new Date(movie.openDate).getTime();
                    const expiredDate = new Date(movie.expiredDate).getTime();
                    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

                    return (
                        (currentTime >= openDate && currentTime <= expiredDate) ||
                        (currentTime + threeDaysInMs >= openDate && currentTime <= openDate)
                    );
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
                            {(() => {
                                const createDate = new Date(movie.createDate).getTime();
                                const editDate = new Date(movie.editDate).getTime();
                                const openDate = new Date(movie.openDate).getTime();

                                if (openDate - currentTime > 0) {
                                    return (
                                        <span className="new_release" style={{ letterSpacing: 0 }}>
                                            即將上映<i className="new_release_icon fa-solid fa-bullhorn"></i>
                                        </span>
                                    );
                                }
                                if (86400000 * 3 > currentTime - editDate) {
                                    return (
                                        <span className="new_release" style={{ letterSpacing: 0 }}>
                                            已更新<i className="new_release_icon fa-solid fa-bullhorn"></i>
                                        </span>
                                    );
                                }
                                if (86400000 * 3 > currentTime - createDate) {
                                    return (
                                        <div class="new-sticker">
                                            <span class="sticker"></span>
                                            <span class="new">新!</span>
                                            <i class='new_release_icon fa-solid fa-bullhorn'></i>
                                        </div>
                                    )
                                }
                            })()}
                        </div>
                        <div className="movie-info">
                            <h3>{movie.title}</h3>
                            <span >{movie.episodes} 集</span>
                        </div>
                        <div className="release_date" style={{ fontSize: "1.5rem" }}>

                            {(() => {
                                const openDate = new Date(movie.openDate).getTime();

                                if (openDate - currentTime > 0) {
                                    return (
                                        <span>開播時間:{formatOpenDate(movie.openDate)}</span>
                                    );
                                }
                            })()}

                        </div>
                        <div className="release_date" style={{ fontSize: "1.5rem" }}>

                            到期時間: <span>
                                {(() => {
                                    const expiredDate = new Date(movie.expiredDate).getTime();
                                    const remainingTime = expiredDate - currentTime;
                                    const openDate = new Date(movie.openDate).getTime();

                                    if (remainingTime > 0 && openDate - currentTime < 0) {
                                        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
                                        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                                        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
                                        return (
                                            <span className='bg-gradient'>
                                                {days}日 {hours}小時 {minutes}分鐘 {seconds}秒
                                            </span>
                                        );
                                    } else if (openDate - currentTime > 0) {
                                        return "尚未開播";
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
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Accordion Item #2</Accordion.Header>
                    <Accordion.Body>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion> */}

        </div>
    );
}