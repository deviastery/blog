import { useState, useEffect} from 'react';
import { getApiResource } from '../utils/getPostsData'

import { IPost } from "../types/data";

export const App: React.FC = () => {

    const [posts, setPosts] = useState<IPost[]>([]);
    const [countPosts, setCountPosts] = useState(10);
    const [page, setPage] = useState(1);
    const [scrollHeight, setScrollHeight] = useState(new Map());
    const [prevViewCount, setPrevViewCount] = useState(0);

    const getResourse = async (url : string) : Promise<IPost[] | boolean> => {
        const res = await getApiResource(url);

        return res;
    };

    const addToMap = (key : number, value : number) => {
        const newMap = new Map(scrollHeight);
        newMap.set(key, value);
        setScrollHeight(newMap);
    };


    const handleScroll = () => {

        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            if (countPosts <= 50) {

                setCountPosts(countPosts + 10); 

                setPrevViewCount(prevViewCount + 10);

                setPage(page + 1);
            }

            addToMap(countPosts, window.innerHeight + window.scrollY);
            
        };

        
        if (window.innerHeight + window.scrollY <= scrollHeight.get(prevViewCount)) {

            setPage(page - 1);
            setPrevViewCount(prevViewCount - 10);

        };

        if (window.innerHeight + window.scrollY > scrollHeight.get(prevViewCount + 10)) {

            setPage(page + 1);
            setPrevViewCount(prevViewCount + 10);

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
    }, [posts, countPosts, prevViewCount]);

    return ( 
            <div >
                {posts.slice(0, countPosts).map((post: IPost, index: number) => (
                    <div key={index}>
                        <h3>{post.title}</h3>
                        <p>{post.body}</p>
                    </div>
                ))}
                {countPosts > 50 && 
                countPosts < 100 && 
                <button 
                    onClick={() => {
                        setCountPosts(countPosts + 10);

                    }}
                >
                    Загрузить еще
                </button>}
            </div>
    )
}