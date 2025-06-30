"use client"
import { useState } from "react"
import PageHeader from "../../../../components/PageHeader"

const UploadResume = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    occupation: "",
    linkedin: "",
    github: "",
    resume: null
  })

  const [dragActive, setDragActive] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData(prev => ({
      ...prev,
      resume: file
    }))
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        resume: files[0]
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    alert("Resume submitted successfully!")
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-gradient-to-br from-[#00ffb4]/40 to-transparent rotate-12 blur-[120px] rounded-[30%] pointer-events-none z-0" />
      <div className="absolute right-0 w-[550px] h-[300px] md:bg-gradient-to-tr from-yellow-400/30 to-transparent rotate-180 blur-[120px] rounded-[20%] pointer-events-none z-0 top-[1.5%]" />
      <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-950/90 to-transparent z-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-grow">
        <PageHeader
          title="Upload Your Resume"
          description="Join our team and help us revolutionize travel payments."
        />

        <div className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-gray-800/50 transform transition-all duration-300 hover:border-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/10">
                <h2 className="text-2xl font-bold mb-6 text-white">Application Form</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="group">
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300 transition-colors duration-300 group-hover:text-white">
                      Full Name <span className="text-teal-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-teal-500 focus:bg-gray-800/80 focus:shadow-lg focus:shadow-teal-500/10 hover:border-gray-600/50 hover:bg-gray-800/70"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Phone Number Field */}
                  <div className="group">
                    <label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-300 transition-colors duration-300 group-hover:text-white">
                      Phone Number <span className="text-teal-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-teal-500 focus:bg-gray-800/80 focus:shadow-lg focus:shadow-teal-500/10 hover:border-gray-600/50 hover:bg-gray-800/70"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {/* Current Occupation Field */}
                  <div className="group">
                    <label htmlFor="occupation" className="block text-sm font-medium mb-2 text-gray-300 transition-colors duration-300 group-hover:text-white">
                      Current Occupation <span className="text-teal-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="occupation"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-teal-500 focus:bg-gray-800/80 focus:shadow-lg focus:shadow-teal-500/10 hover:border-gray-600/50 hover:bg-gray-800/70"
                      placeholder="e.g., Senior Frontend Developer"
                    />
                  </div>

                  {/* Social Links - Side by Side on larger screens */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* LinkedIn URL Field */}
                    <div className="group">
                      <label htmlFor="linkedin" className="block text-sm font-medium mb-2 text-gray-300 transition-colors duration-300 group-hover:text-white">
                        LinkedIn Profile
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
                          </svg>
                        </div>
                        <input
                          type="url"
                          id="linkedin"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-teal-500 focus:bg-gray-800/80 focus:shadow-lg focus:shadow-teal-500/10 hover:border-gray-600/50 hover:bg-gray-800/70"
                          placeholder="linkedin.com/in/yourprofile"
                        />
                      </div>
                    </div>

                    {/* GitHub URL Field */}
                    <div className="group">
                      <label htmlFor="github" className="block text-sm font-medium mb-2 text-gray-300 transition-colors duration-300 group-hover:text-white">
                        GitHub Profile
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                          </svg>
                        </div>
                        <input
                          type="url"
                          id="github"
                          name="github"
                          value={formData.github}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-teal-500 focus:bg-gray-800/80 focus:shadow-lg focus:shadow-teal-500/10 hover:border-gray-600/50 hover:bg-gray-800/70"
                          placeholder="github.com/yourusername"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Resume Upload Field */}
                  <div className="group pt-2">
                    <label className="block text-sm font-medium mb-2 text-gray-300 transition-colors duration-300 group-hover:text-white">
                      Upload Resume <span className="text-teal-500">*</span>
                    </label>
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer ${
                        dragActive
                          ? "border-teal-500 bg-teal-500/10"
                          : "border-gray-700/50 hover:border-teal-500/50 hover:bg-gray-800/30"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById("resume-upload").click()}
                    >
                      <input
                        type="file"
                        id="resume-upload"
                        name="resume"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        required
                      />
                      
                      <div className="space-y-3">
                        <svg
                          className={`w-12 h-12 mx-auto transition-all duration-300 ${
                            formData.resume ? "text-teal-500" : "text-gray-500 group-hover:text-teal-500"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        
                        {formData.resume ? (
                          <div>
                            <p className="text-teal-500 font-medium truncate">{formData.resume.name}</p>
                            <p className="text-gray-400 text-sm mt-1">Click to change file</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-300 font-medium">
                              Drag & drop your resume here or <span className="text-teal-500">click to browse</span>
                            </p>
                            <p className="text-gray-400 text-sm mt-2">Supports: PDF, DOC, DOCX (Max 5MB)</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      className="w-full px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg text-white font-medium transition-all duration-300 hover:from-teal-600 hover:to-teal-700 hover:shadow-lg hover:shadow-teal-500/25 hover:scale-[1.02] transform focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      Submit Application
                    </button>
                  </div>

                  <div className="pt-4 text-center">
                    <p className="text-gray-400 text-sm">
                      By submitting this form, you agree to our{' '}
                      <a href="#" className="text-teal-500 hover:underline">privacy policy</a> and{' '}
                      <a href="#" className="text-teal-500 hover:underline">terms of service</a>.
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar Information Section */}
            <div className="lg:col-span-1 space-y-6">
              {/* What Happens Next Section */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 transform transition-all duration-300 hover:translate-y-[-4px] hover:bg-gray-900/90 hover:border-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/10">
                <h3 className="text-xl font-bold mb-4 text-teal-500">What Happens Next?</h3>
                <div className="space-y-4">
                  {[
                    {
                      step: "1",
                      title: "Application Review",
                      description: "Our team will review your application within 2-3 business days."
                    },
                    {
                      step: "2",
                      title: "Initial Contact",
                      description: "If you're a good fit, we'll reach out to schedule a preliminary interview."
                    },
                    {
                      step: "3",
                      title: "Interview Process",
                      description: "Meet with our team to discuss your experience and learn more about the role."
                    },
                    {
                      step: "4",
                      title: "Decision",
                      description: "We'll make a decision and communicate our feedback within a week."
                    }
                  ].map((item) => (
                    <div key={item.step} className="flex items-start group">
                      <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5 transition-all duration-300 group-hover:bg-teal-500/30 group-hover:scale-110 flex-shrink-0">
                        <span className="text-teal-500 font-bold text-sm">{item.step}</span>
                      </div>
                      <div>
                        <h4 className="text-gray-300 font-medium transition-colors duration-300 group-hover:text-white">
                          {item.title}
                        </h4>
                        <p className="text-gray-400 text-sm transition-colors duration-300 group-hover:text-gray-300">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips Section */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 transform transition-all duration-300 hover:translate-y-[-4px] hover:bg-gray-900/90 hover:border-yellow-500/30 hover:shadow-2xl hover:shadow-yellow-500/10">
                <h3 className="text-xl font-bold mb-4 text-yellow-500">Application Tips</h3>
                <ul className="space-y-3">
                  {[
                    "Ensure your resume is up-to-date with relevant experience",
                    "Highlight projects that demonstrate your skills",
                    "Include links to your portfolio or GitHub if applicable",
                    "Double-check your contact information",
                    "Customize your application for the role you're applying for"
                  ].map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300 text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Section */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 transform transition-all duration-300 hover:translate-y-[-4px] hover:bg-gray-900/90 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10">
                <h3 className="text-xl font-bold mb-4 text-purple-500">Questions?</h3>
                <p className="text-gray-300 text-sm mb-4">
                  We're happy to help with any questions about the application process.
                </p>
                <a
                  href="mailto:tripxpay@gmail.com"
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-300"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  careers@tripxpay.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadResume