import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import UploadBlogsClient from "./UploadBlogsClient";

async function getInitialBlogs() {
  const res = await fetch(
    `http://localhost:3000/api/getallblogs?page=1&pageSize=9`,
    { method: "POST", next: { revalidate: 60 } } // ISR: revalidate every 60s
  );

  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
}

export default async function UploadBlogsPage() {
  const { blogs, totalCount, nextLastKey } = await getInitialBlogs();
  // console.log(JSON.stringify(blogs, null, 2));
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-gradient-to-br from-[#00ffb4]/40 to-transparent rotate-12 blur-[120px] rounded-[30%] pointer-events-none z-0" />
      <div className="absolute right-0 w-[550px] h-[300px] md:bg-gradient-to-tr from-yellow-400/30 to-transparent rotate-180 blur-[120px] rounded-[20%] pointer-events-none z-0 top-[1.5%]" />
      <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none z-0" />

      <div className="relative z-10">
        <Navbar />
        <PageHeader
          title="TripxPay Announcements"
          description="Stay informed about the latest updates, features, and events."
        />
        {/* Client component handles filtering, pagination, refresh */}
        <UploadBlogsClient
          initialBlogs={blogs}
          initialTotalCount={totalCount}
          initialLastKey={nextLastKey}
        />
      </div>

      <Footer />
    </div>
  );
}
