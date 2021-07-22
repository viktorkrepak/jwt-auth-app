import React from 'react';
import { useByeQuery } from '../generated/graphql';

interface ByeProps {}

export const Bye: React.FC<ByeProps> = ({}) => {
  const { data, error, loading } = useByeQuery({
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.log(error);

    return <div>error</div>;
  }

  return <div>{data ? <div>{data.bye}</div> : <span>No data</span>}</div>;
};
