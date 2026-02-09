import { useEffect, useMemo, useState } from "react";
import { useDispatch } from 'react-redux';
import { getPosts } from './actions/posts';
import { fetchMe, logout } from "./api";
import Posts from "./components/Posts";
import Form from "./components/Form";
import Auth from "./components/Auth";
import memories from './images/memories.png'
import "./index.css";

const App = () => {
  const [currentId, setCurrentId] = useState(null);
  const [auth, setAuth] = useState(null);
  const [authResolved, setAuthResolved] = useState(false);
  const dispatch = useDispatch();

  const isAuthed = Boolean(auth?.user);
  const user = useMemo(() => auth?.user || null, [auth]);

  useEffect(() => {
    let isMounted = true;
    const loadMe = async () => {
      try {
        const { data } = await fetchMe();
        if (isMounted && data) {
          setAuth({ user: data });
        }
      } catch (error) {
        if (isMounted) {
          setAuth(null);
        }
      } finally {
        if (isMounted) {
          setAuthResolved(true);
        }
      }
    };

    loadMe();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isAuthed) {
      dispatch(getPosts());
    }
  }, [currentId, dispatch, isAuthed]);

  const handleLogin = (nextAuth) => {
    setAuth(nextAuth);
  };

  const handleLogout = () => {
    setAuth(null);
    logout().catch(() => {});
  };

  if (!authResolved) {
    return <div className="max-w-7xl mx-auto p-4">Loading...</div>;
  }

  if (!isAuthed) {
    return <Auth onAuth={handleLogin} />;
  }
  
  return (
    <div className="max-w-7xl mx-auto p-4 ">
      <div className="flex items-center justify-between mt-2">
        <div className="text-sm text-gray-500">
          Signed in as <span className="font-semibold text-gray-700">{user?.name}</span>
        </div>
        <button
          className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
          onClick={handleLogout}
          type="button"
        >
          Log out
        </button>
      </div>

      <div className="bg-white rounded-xl flex flex-row justify-center items-center my-8 shadow-lg p-4">
        <h2 className="text-4xl text-blue-500 font-bold text-center">Memories</h2>
        <img className="ml-4 h-14" src={memories} alt="memories" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Posts setCurrentId={setCurrentId} user={user} />
        </div>
        <div>
          <Form currentId={currentId} setCurrentId={setCurrentId} user={user} />
        </div>
      </div>
    </div>
  );
};

export default App;
