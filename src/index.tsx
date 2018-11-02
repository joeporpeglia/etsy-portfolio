import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Shop, User } from './EtsyApi';
import shopResponse from './shop.json';
import userResponse from './user.json';

const user: User = userResponse.results[0];
const shop: Shop = shopResponse.results[0];

ReactDOM.render(
  <BrowserRouter>
    <App user={user} shop={shop} />
  </BrowserRouter>,
  document.getElementById('root')
);
