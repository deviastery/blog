import { IPost } from "../types/data";

export const getApiResource = async (url: string): Promise<IPost[] | IPost | boolean> => {
    
    try {
        const res = await fetch(url);

        if(!res.ok) {
            console.error('Could not fetch.', res.status);
            return false;
        }
        return await res.json();
        
    } catch (error : any) {
        console.error('Could not fetch.', error.message);
        return false;
    }
};