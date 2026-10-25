import type { ReactNode } from "react";
import Footer from "./footer";

type InfoPageLayoutProps = {
    children: ReactNode;
};

export default function InfoPageLayout({children,}: InfoPageLayoutProps) {
    return(
        <>
            <main>{children}</main>
            <Footer />
        </>
    );
}