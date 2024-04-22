import { FC, ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Head from "next/head";

interface Props {
    children: ReactNode;
}
const Layout: FC<Props> = ({ children }) => {
    return (
        <>
            <div className="flex flex-col min-h-screen">
                <Head>
                    <meta http-equiv="Content-Security-Policy" content="default-src 'self' https://cdn.ngrok.com 'unsafe-eval' 'unsafe-inline'; font-src 'self' data:;" />
                </Head>
                <main className="flex flex-col flex-1 bg-muted/50">
                    {children}
                </main>
            </div>
        </>
    );
};

export default Layout;
