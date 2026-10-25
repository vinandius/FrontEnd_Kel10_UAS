import type { ReactNode } from "react";
import Navbar from "./navbar";
import Footer from "./footer";

type InfoPageLayoutProps = {
    children: ReactNode;
};

export default function InfoPageLayout({
    children,
}: InfoPageLayoutProps) {
    return(
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    );
}