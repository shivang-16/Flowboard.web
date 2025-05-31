import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flowboard | Login",
  description: "Visualize, organize, and own your workflow with clarity.",
};

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
        <div>
          {children}
        </div>
    </>
  );
}
