import React from "react";
import Header from "./Header";
import { Footer } from "./Footer";
// import { Props } from "@/types";
// import { getStaticProps } from "@/lib/fetchData";

interface LayoutProps {
  children?: React.ReactNode;
  // header?: Props["header"];
  // footer?: Props["footer"];
}
// export { getStaticProps };
export default function Layout({children}:LayoutProps ) {
// export default function Layout({ header, footer, children }: LayoutProps) {
  return (
    <>
      <Header />
      <main className="overflow-hidden">{children}</main>
      <Footer />
    </>
  );
}
