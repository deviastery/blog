import { useRef, useState, useEffect, useLayoutEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getApiResource } from '../utils/getPostsData'

import { IPost } from "../types/data";

export const App: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [posts, setPosts] = useState<IPost[]>([]);
    const [countPosts, setCountPosts] = useState(10);
    const [page, setPage] = useState(1);
    const [startsPage, setStartsPage] = useState(new Map());

    const postsRef = useRef<HTMLDivElement | null>(null);
    const [postsHeight, setPostsHeight] = useState<number>(0);

    const getResourse = async (url : string) : Promise<IPost[] | boolean> => {
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

        for (let [pageHeight, height] of heights) {
            console.log("pageHeight: ", pageHeight);
            console.log('height: ', height);
            
            let nextHeight = heights.get((++page).toString());

            console.log('nextHeight: ', nextHeight);

            if (!nextHeight || window.scrollY < nextHeight) {

                return --page;
            }
        }

        return page;
    };


    const handleScroll = () => {
        // console.log("Page: ", page);
        // console.log("height: ", postsHeight);
        // console.log("map: ", scrollHeight);
        // console.log("window.scrollY: ", window.scrollY);
        // console.log("prevViewCount: ", prevViewCount);
        // console.log("countPosts: ", countPosts);

        const newPage = getPage(startsPage);
        // console.log("newPage: ", newPage);

        setPage(newPage);

        console.log('window.scrollY: ', window.scrollY);
        console.log('page: ', page);

        // console.log("Page: ", page);
            
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            
            // addToMap(countPosts.toString(), postsHeight);

            if (countPosts <= 50) {

                setCountPosts(countPosts + 10); 
            };
            
        };  

    };

    useEffect(() => {
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
        if (!startsPage.has(countPosts.toString())) {
            addStart((countPosts / 10).toString(), postsHeight);
        }
    }, [countPosts]);

    return (
        <div>
            <div id='posts' ref={postsRef}>
                {posts.slice(0, countPosts).map((post: IPost, index: number) => (
                    <div key={index}>
                        <h3>{index}</h3>
                        <h3>{post.title}</h3>
                        <p>{post.body}</p>
                    </div>
                ))}
            </div>
            {countPosts > 50 && countPosts < 100 && (
                <button 
                    onClick={() => {
                        setCountPosts(countPosts + 10);
                    }}
                >
                    Загрузить еще
                </button>
            )}
        </div>
    );
}
