import React, { useRef, useState, useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

import { getApiResource } from '../../utils/getPostsData'

import { IPost } from "../../types/data";

import styles from './AllPostsPage.module.css';

const AllPostsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [posts, setPosts] = useState<IPost[]>([]);
    const [countPosts, setCountPosts] = useState(10);
    const [page, setPage] = useState(1);
    const [startsPage, setStartsPage] = useState(new Map());

    const postsRef = useRef<HTMLDivElement | null>(null);
    const [postsHeight, setPostsHeight] = useState<number>(0);

    const getResourse = async (url : string) : Promise<IPost[] | IPost | boolean> => {

        const res = await getApiResource(url);
        return res;
    };

    const addStart = (key : string, value : number) => {
        const newMap = new Map(startsPage);
        newMap.set(key, value);
        setStartsPage(newMap);
    };

    const updateURL = (page: number) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('page', page.toString());

        navigate(`?${searchParams.toString()}`, { replace: true });
    };

    const getPage = ( heights : Map<string, number>) : number => {

        let page = 1;

        for (let _ of heights) {
            
            let nextHeight = heights.get((++page).toString());

            if (!nextHeight || window.scrollY < nextHeight) {
                return --page;
            }
        }
        return page;
    };


    const handleScroll = () => {

        localStorage.setItem('countPosts', JSON.stringify(countPosts));
        localStorage.setItem('startsPage', JSON.stringify(Object.fromEntries(startsPage)));

        const newPage = getPage(startsPage);
        setPage(newPage);
            
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            
            if (countPosts <= 50) {
                setCountPosts(countPosts + 10); 
            };
            
        };  

    };

    useEffect(() => {

        const startsPageFromLocalStorage = localStorage.getItem('startsPage');

        if (startsPageFromLocalStorage) {
            setStartsPage(new Map(Object.entries(JSON.parse(startsPageFromLocalStorage))));
        } 
        
        setCountPosts(JSON.parse(localStorage.getItem('countPosts') || "10"));
        

        (async () => {
            const res = await getResourse('https://jsonplaceholder.typicode.com/posts');

            if (Array.isArray(res)) {

                    setPosts(res);
                }
        })();
    }, []);

    useEffect(() => {

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
            
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postsHeight]);

    useEffect(() => {
        updateURL(page);
            
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        if (postsRef.current) {
            setPostsHeight(postsRef.current.clientHeight);
        }
    });

    useEffect(() => {

        const startsPageFromLocalStorage = localStorage.getItem('startsPage');

        if (startsPageFromLocalStorage) {
            let currentStartsPage = new Map(Object.entries(JSON.parse(startsPageFromLocalStorage)));

            if (!currentStartsPage.has((countPosts / 10).toString())) {                
                
                addStart((countPosts / 10).toString(), postsHeight);

                localStorage.setItem('startsPage', JSON.stringify(Object.fromEntries(startsPage)));

            }
        } else {

            addStart((countPosts / 10).toString(), postsHeight);
        }
    }, [countPosts]);

    return (
        <div className={styles.wrapper}>            
            <div id='posts' ref={postsRef}  className={styles.container__posts}>
                <ul className={styles.ul__posts}>
                    {posts.slice(0, countPosts).map((post: IPost, id: number) => (
                        <li key={id} className={styles.container__post}>
                            <Link to={`/posts/${id}`} className={styles.post}>
                                <h3 className={styles.post__title}>{post.title}</h3>
                                <p className={styles.post__body}>{post.body}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {countPosts > 50 && countPosts < 100 && (
                <div className={styles.container__button}>
                    <button 
                        onClick={() => {
                            setCountPosts(countPosts + 10);
                        }}
                        className={styles.posts__button}
                    >
                        Загрузить еще
                    </button>
                </div>
            )}
        </div>
    );
}

export default AllPostsPage;
