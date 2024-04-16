import { FC, ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";

interface Props {
    children: ReactNode;
}
const Layout: FC<Props> = ({ children }) => {
    return (
        <>
            <div className="flex flex-col min-h-screen">
                <main className="flex flex-col flex-1 bg-muted/50">
                    {children}
                </main>
            </div>
        </>
    );
};

export default Layout;
