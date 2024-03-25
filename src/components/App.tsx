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
    const [scrollHeight, setScrollHeight] = useState(new Map());
    const [prevViewCount, setPrevViewCount] = useState(10);

    const postsRef = useRef<HTMLDivElement | null>(null);
    const [postsHeight, setPostsHeight] = useState<number>(0);

    const getResourse = async (url : string) : Promise<IPost[] | boolean> => {
        const res = await getApiResource(url);

        return res;
    };

    const addToMap = (key : number, value : number) => {
        const newMap = new Map(scrollHeight);
        newMap.set(key, value);
        setScrollHeight(newMap);
    };

    const updateURL = (page: number) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('page', page.toString());

        navigate(`?${searchParams.toString()}`, { replace: true });
    };


    const handleScroll = () => {
        console.log("Page: ", page);
        console.log("height: ", postsHeight);
        console.log("map: ", scrollHeight);
        console.log("window.scrollY: ", window.scrollY);
        console.log("prevViewCount: ", prevViewCount);
            
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            
            addToMap(countPosts, postsHeight);

            if (countPosts <= 50) {

                setCountPosts(countPosts + 10); 
            };
            
        };     

        if (window.scrollY > scrollHeight.get(prevViewCount)) {

            setPage(page + 1);
            updateURL(page + 1);
            setPrevViewCount(prevViewCount + 10);

        };
           
        if (scrollHeight.size > 1 && window.scrollY < scrollHeight.get(prevViewCount - 10)) {

            setPage(page - 1);
            updateURL(page - 1);
            setPrevViewCount(prevViewCount - 10);

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
        updateURL(page);

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
            
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posts, countPosts, prevViewCount, postsHeight]);

    useEffect(() => {
        if (postsRef.current) {
            setPostsHeight(postsRef.current.clientHeight);
        }
    })

    return (
        <div>
            <div id='posts' ref={postsRef}>
                {posts.slice(0, countPosts).map((post: IPost, index: number) => (
                    <div key={index}>
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
