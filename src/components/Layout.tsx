import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const Layout = ({ children, hideFooter = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#ffffff' }}>
      <Header />
      <main className={`flex-1 flex justify-center ${hideFooter ? '' : 'items-center p-8'}`} style={{ backgroundColor: '#ffffff' }}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
