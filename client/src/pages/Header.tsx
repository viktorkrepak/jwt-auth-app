import React from 'react';
import { Link } from 'react-router-dom';
import { setAccessToken } from '../accessToken';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  const { data } = useMeQuery({
    fetchPolicy: 'network-only',
  });
  const [logout, { client }] = useLogoutMutation();

  return (
    <header>
      <ul>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/bye">Bye</Link>
        </li>
      </ul>
      <button
        onClick={async () => {
          await logout();
          setAccessToken('');
          await client!.resetStore();
        }}
      >
        Logout
      </button>
      {data && data.me ? (
        <div>You're logged in as: {data.me.email}</div>
      ) : (
        <div>Not logged in</div>
      )}
    </header>
  );
};
