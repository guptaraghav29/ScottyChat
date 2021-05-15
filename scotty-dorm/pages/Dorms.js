import Head from 'next/head'
import Navigation from './Navigation';

export default function Dorms() {
    return (
        <div>
            <Head>
                <title> Dorms </title>
            </Head>
            <Navigation></Navigation>
            <h1> Dorms </h1>
            <p> A-I </p>
            <p> Lothian </p>
            <p> Pentland </p>
            <p> Dundee </p>
        </div>
    )
}