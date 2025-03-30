import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
  weight:"variable",
  display: "swap",
});


export const metadata: Metadata = {
  title: "Prepwise",
  description: "An AI-powered platform for preparing for mock interviews.",
};

//helper function
function isAuthRoute() {
  // Add all auth-related routes here
  const authRoutes = ['/sign-in', '/sign-up', '/forgot-password'];
  return authRoutes.some(route => window.location.pathname.startsWith(route));
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if(!isAuthRoute){
    const isUserAuthenticated = await isAuthenticated();
    if(!isUserAuthenticated) redirect('/sign-in')
    console.log(isAuthenticated)
  }
  return (
    <html lang="en" className="dark">
      <body
        className={`${monaSans.className} antialiased pattern`}
      >
        {children}
        <Toaster/>
      </body>
    </html>
  );
}
