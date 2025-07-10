import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
        <Navbar/>
        {children}
        <Footer/>
    </div>
  );
}
