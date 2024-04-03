import { Routes, Route } from "react-router-dom";
import AllPostsPage from "../../containers/AllPostsPage";
import SinglePostPage from "../../containers/SinglePostPage";


const App: React.FC = () => {
    
    return (
        <div>
            <Routes>
                    <Route 
                        path="/posts"
                        Component={AllPostsPage}
                    />
                    <Route 
                        path="/posts/:id"
                        Component={SinglePostPage}
                    />
            </Routes>
        </div>
    );
};

export default App;
