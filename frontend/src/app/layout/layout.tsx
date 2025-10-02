import { FC, ReactNode } from "react";
import { Toaster } from "@/shared/ui/toaster.tsx";
import { Header } from "@/widgets/common/header";
import { Navbar } from "@/widgets/common/navbar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div className="flex">
        <Navbar />
        <div className="flex flex-col w-full">
          <header className="bg-white flex flex-col gap-y-[20px] w-full pt-[40px] px-[30px]">
            <Header />
          </header>

          <main className="bg-white h-[calc(100vh_-_187px)] overflow-y-auto px-[30px] w-full pt-[20px]">
            {children}
          </main>
        </div>
      </div>

      <Toaster />
    </>
  );
};
