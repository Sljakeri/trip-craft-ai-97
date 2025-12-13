import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const Layout = ({ children, hideFooter = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className={`flex-1 flex justify-center bg-white ${hideFooter ? '' : 'items-center p-8'}`}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
