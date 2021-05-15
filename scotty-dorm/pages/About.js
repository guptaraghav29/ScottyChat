import Head from 'next/head'
import Navigation from './Navigation';

export default function About() {
    return (
        <div>
            <Head>
                <title> About </title>
            </Head>
            <Navigation></Navigation>
            <h1> About </h1>
            <p> ScottyDorm is... </p>
        </div >
    )
}