import Head from 'next/head'
import React from 'react';
import Navigation from './Navigation';
import { Route, Switch } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <Head>
        <title> ScottyDorm </title>
      </Head>
      <Navigation>
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/Login" exact component={() => <Login />} />
          <Route path="/Dorms" exact component={() => <Dorms />} />
          <Route path="/About" exact component={() => <About />} />
        </Switch>
      </Navigation>
      <h1 style={{ borderTopWidth: '10em;' }}> Welcome to ScottyDorm! </h1>
      <p></p>
    </div>
  )
}
