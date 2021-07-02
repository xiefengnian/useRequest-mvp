import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Link, Route, Switch } from 'react-router-dom';

import Mvp1 from './mvp_1/example';
import Mvp2 from './mvp_2/example';

const Home = () => {
  return (
    <ul>
      <li>
        <Link to="/mvp1">mvp 1</Link>
      </li>
      <li>
        <Link to="/mvp2">mvp 2</Link>
      </li>
    </ul>
  );
};

const App = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/" exact>
          <Home></Home>
        </Route>
        <Route path="/mvp1" exact>
          <Mvp1></Mvp1>
        </Route>
        <Route path="/mvp2" exact>
          <Mvp2></Mvp2>
        </Route>
      </Switch>
    </HashRouter>
  );
};

ReactDOM.render(<App></App>, document.getElementById('root'));
