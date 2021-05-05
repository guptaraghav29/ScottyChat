import logo from './logo.svg';
import './App.css';

let headerStyle = {
  color: '#ff0000'
}

function App() {
  return (
    <div className="App">
      <h1 style={headerStyle}>Scotty Dorm</h1>
      <p>It's like Yelp, but for UCR dorms!</p>
    </div>
  );
}

export default App;
