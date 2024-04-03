import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";

import { getApiResource } from "../../utils/getPostsData";

import { IPost } from "../../types/data";

import styles from "./SinglePostPage.module.css";

const SinglePostPage: React.FC = () => {

    const [post, setPost] = useState<IPost>();

    const { id } = useParams();
    const postId = id && parseInt(id, 10) + 1;

    const getResourse = async (url : string) : Promise<IPost[] | IPost | boolean> => {

        const res = await getApiResource(url);
        return res;
    };

    useEffect(() => {

        (async () => {
            const res = await getResourse(`https://jsonplaceholder.typicode.com/posts/${postId}/`);

            if (res !== true && res !== false && !Array.isArray(res)) {

                    setPost(res);
                }
        })();
    }, []);

    return (
        <div className={styles.container__post}>
            {post && (
                <div className={styles.post}>
                    <h3 className={styles.post__title}>{post.title}</h3>
                    <p className={styles.post__body}>{post.body}</p>
                </div>
            )}
        </div>
    )
};

export default SinglePostPage;