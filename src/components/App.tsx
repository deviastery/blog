import { useState, useEffect } from 'react';
import { getApiResource } from '../utils/getPostsData'

import { IPost } from "../types/data";

export const App: React.FC = () => {
    const [posts, setPosts] = useState<IPost[]>([])
    const [countPosts, setCountPosts] = useState(0)

    const getResourse = async (url : string) : Promise<IPost[] | boolean> => {
        const res = await getApiResource(url);

        if (Array.isArray(res)) {
            const nextPosts = res.slice(0, 10);
            setCountPosts(countPosts + 10);

            setPosts(nextPosts);
        }

        return res;
    }

    useEffect(() => {
        getResourse('https://jsonplaceholder.typicode.com/posts');
    }, [])

    return (
        <div>
            {posts.map((post: IPost, index: number) => (
                <div key={index}>
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>
                </div>
            ))}
        </div>
    )
}