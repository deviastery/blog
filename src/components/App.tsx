import { useState, useEffect} from 'react';
import { getApiResource } from '../utils/getPostsData'

import { IPost } from "../types/data";

export const App: React.FC = () => {
    const [posts, setPosts] = useState<IPost[]>([]);
    const [nextCountPosts, setNextCountPosts] = useState(10);

    const getResourse = async (url : string) : Promise<IPost[] | boolean> => {
        const res = await getApiResource(url);

        return res;
    };

    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            if (nextCountPosts <= 50) {
                setNextCountPosts(nextCountPosts + 10);      
            }
        }       
        
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
            
    }, [posts, nextCountPosts]);

    return ( 
        <div >
            {posts.slice(0, nextCountPosts).map((post: IPost, index: number) => (
                <div key={index}>
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>
                </div>
            ))}
            {nextCountPosts > 50 && 
            nextCountPosts < 100 && 
            <button 
                onClick={() => setNextCountPosts(nextCountPosts + 10)}
            >
                Загрузить еще
            </button>}
        </div>
    )
}