import { Suspense } from "react";
import Loading from "@/app/Loading";
import Header from "@/components/Header";
import CheckAuth from "@/components/CheckAuth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // p-3
  return (
    <main className="w-full h-full">
      <CheckAuth />
      <div className="flex flex-col gap-y-2 sm:gap-y-3">
        <nav className="bg-slate-900 shadow shadow-white rounded-b-3xl sm:py-3 md:py-4 px-5 py-2 sm:px-4  md:px-5  lg:px-8 ">
          <Header />
        </nav>
        <Suspense fallback={<Loading />}>
          <div className="mt-4">{children}</div>
        </Suspense>
      </div>
    </main>
  );
}
