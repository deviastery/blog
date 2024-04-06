import { BrowserRouter, Routes, Route } from "react-router-dom";
import AllPostsPage from "../../containers/AllPostsPage";
import SinglePostPage from "../../containers/SinglePostPage";


const App: React.FC = () => {
    
    return (
        <>
            <BrowserRouter basename={`/blog/`}>
                <div>
                    <Routes>
                            <Route 
                                path="/"
                                element={<AllPostsPage />}
                            />
                            <Route 
                                path="/:id"
                                element={<SinglePostPage />}
                            />
                    </Routes>
                </div>
            </BrowserRouter>
        </>
    );
};

export default App;
