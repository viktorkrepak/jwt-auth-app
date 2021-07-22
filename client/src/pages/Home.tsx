import React from 'react';
import { Link } from 'react-router-dom';
import { useUsersQuery } from '../generated/graphql';

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
  const { data, loading } = useUsersQuery({ fetchPolicy: 'network-only' });

  if (loading || !data) {
    <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Users:</h2>
      <ul>
        {data?.users.map((user) => {
          return (
            <li key={user.id}>
              {user.email}, {user.id}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
