import PageHeader from "../../../components/PageHeader"

const PrivacyPolicyPage = () => {
  const sections = [
    {
      title: "Will be updated soon !!!",
      content: "Our privacy policy will be updated soon. Please check back later for detailed information about how we collect, use, and protect your personal information."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col relative overflow-hidden">
      {/* Top-left glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-gradient-to-br from-[#00ffb4]/40 to-transparent rotate-12 blur-[120px] rounded-[30%] pointer-events-none z-0" />
      
      {/* Top-right yellow glow */}
      <div className="absolute right-0 w-[550px] h-[300px] md:bg-gradient-to-tr from-yellow-400/30 to-transparent rotate-180 blur-[120px] rounded-[20%] pointer-events-none z-0 top-[1.5%]" />

      {/* Optional grid dots background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none z-0" />

      <div className="relative z-10">

        <PageHeader title="Privacy Policy" description="Last updated: May 15, 2025" />

      <div className="flex-grow py-12 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-xl font-bold mb-3">{section.title}</h2>
                <p className="text-gray-300 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage