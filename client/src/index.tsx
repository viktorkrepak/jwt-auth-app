import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client';
import { ApolloProvider } from '@apollo/react-hooks';
import { setContext } from '@apollo/client/link/context';
import { getAccessToken, setAccessToken } from './accessToken';
import { App } from './App';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const accessToken = getAccessToken();

  console.log(accessToken, 'sss');

  return {
    headers: {
      ...headers,
      authorization: accessToken ? `bearer ${accessToken}` : '',
    },
  };
});

const client = new ApolloClient({
  link: from([
    new TokenRefreshLink({
      accessTokenField: 'accessToken',
      isTokenValidOrUndefined: () => {
        const token = getAccessToken();
        if (!token) {
          return true;
        }

        try {
          const { exp }: { exp: number } = jwtDecode(token);

          if (Date.now() >= exp * 1000) {
            return false;
          } else {
            return true;
          }
        } catch (error) {
          return false;
        }
      },
      fetchAccessToken: () => {
        return fetch('http://localhost:4000/refresh_token', {
          method: 'POST',
          credentials: 'include',
        });
      },
      handleFetch: (accessToken) => {
        setAccessToken(accessToken);
      },
      handleError: (err) => {
        // full control over handling token fetch Error
        console.warn('Your refresh token is invalid. Try to relogin');
      },
    }),
    authLink,
    httpLink,
  ]),
  cache: new InMemoryCache(),
  credentials: 'include',
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
