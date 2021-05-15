import Head from 'next/head'
import Navigation from './Navigation';

export default function Login() {
    return (
        <div>
            <Head>
                <title> Login </title>
            </Head>
            <Navigation></Navigation>
            <h1> Login </h1>
            <p> Username </p>
            <p> Password </p>
        </div>
    )
}