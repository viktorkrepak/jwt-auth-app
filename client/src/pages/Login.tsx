import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { setAccessToken } from '../accessToken';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useLoginMutation();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const response = await login({
          variables: {
            email,
            password,
          },
          update: (store, { data }) => {
            if (!data) {
              return null;
            }
            store.writeQuery<MeQuery>({
              query: MeDocument,
              data: {
                me: data.login.user,
              },
            });
          },
        });

        console.log(response, 'response');
        if (response && response.data) {
          setAccessToken(response.data.login.accessToken);
        }
        history.push('/');
      }}
    >
      <h1>Login page</h1>
      <div>
        <input
          type="text"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <button type="submit">Submit form</button>
    </form>
  );
};
