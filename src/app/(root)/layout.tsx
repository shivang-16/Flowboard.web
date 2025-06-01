import { getUser } from "@/actions/user_actions";
import Sidebar from "@/components/shared/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flowboard",
  description: "Visualize, organize, and own your workflow with clarity.",
};

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const data = await getUser() || null

  return (
    <>      
      <div className="flex overflow-hidden">
        <div className="p-4 w-full">
          {children}
        </div>
      </div>
    </>
  );
}
