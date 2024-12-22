import logo from './logo.svg';
import './App.css';
import AddUser from './component/adduser';
import { Query } from 'firebase/firestore';
import './index.css';
import QueryUsers from './component/queryuser';

function App() {
  return (
    <div className="App">
    <div className="flex justify-between space-x-8 p-8">
      {/* Left Section: AddUser */}
      <div className="flex-1">
        <AddUser />
      </div>

      {/* Right Section: QueryUsers */}
      <div className="flex-1">
        <QueryUsers />
      </div>
    </div>
  </div>
  );
}

export default App;
