import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Explorer from './pages/Explorer';
import Block from './pages/Block';
import Transaction from './pages/Transaction';
import Account from './pages/Account';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Explorer} />
        <Route path="/block/:number" component={Block} />
        <Route path="/tx/:hash" component={Transaction} />
        <Route path="/address/:address" component={Account} />
      </Switch>
    </Router>
  );
}

export default App;
