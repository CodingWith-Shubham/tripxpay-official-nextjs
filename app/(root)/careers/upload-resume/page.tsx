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
    // Handle form submission here
    console.log("Form submitted:", formData)
    alert("Resume submitted successfully!")
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col relative overflow-hidden">
      {/* Background glow effects - same as careers page */}
      <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-gradient-to-br from-[#00ffb4]/40 to-transparent rotate-12 blur-[120px] rounded-[30%] pointer-events-none z-0" />
      <div className="absolute right-0 w-[550px] h-[300px] md:bg-gradient-to-tr from-yellow-400/30 to-transparent rotate-180 blur-[120px] rounded-[20%] pointer-events-none z-0 top-[1.5%]" />
      <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none z-0" />

      <div className="relative z-10">
        <PageHeader
          title="Upload Your Resume"
          description="Join our team and help us revolutionize travel payments."
        />

        <div className="flex-grow py-12 px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-8 border border-gray-800/50 transform transition-all duration-300 hover:border-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300 transition-colors duration-300 group-hover:text-white">
                    Full Name *
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
                    Phone Number *
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
                    Current Occupation *
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

                {/* LinkedIn URL Field */}
                <div className="group">
                  <label htmlFor="linkedin" className="block text-sm font-medium mb-2 text-gray-300 transition-colors duration-300 group-hover:text-white">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-teal-500 focus:bg-gray-800/80 focus:shadow-lg focus:shadow-teal-500/10 hover:border-gray-600/50 hover:bg-gray-800/70"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                {/* GitHub URL Field */}
                <div className="group">
                  <label htmlFor="github" className="block text-sm font-medium mb-2 text-gray-300 transition-colors duration-300 group-hover:text-white">
                    GitHub Profile URL
                  </label>
                  <input
                    type="url"
                    id="github"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-teal-500 focus:bg-gray-800/80 focus:shadow-lg focus:shadow-teal-500/10 hover:border-gray-600/50 hover:bg-gray-800/70"
                    placeholder="https://github.com/yourusername"
                  />
                </div>

                {/* Resume Upload Field */}
                <div className="group">
                  <label className="block text-sm font-medium mb-2 text-gray-300 transition-colors duration-300 group-hover:text-white">
                    Upload Resume *
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
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
                    
                    <div className="space-y-2">
                      <svg
                        className="w-12 h-12 text-teal-500 mx-auto transition-all duration-300 hover:scale-110"
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
                          <p className="text-teal-500 font-medium">{formData.resume.name}</p>
                          <p className="text-gray-400 text-sm">Click to change file</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-300 font-medium">
                            Drop your resume here or <span className="text-teal-500">click to browse</span>
                          </p>
                          <p className="text-gray-400 text-sm">PDF, DOC, or DOCX files only</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-teal-500 rounded-lg text-white font-medium transition-all duration-300 hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-500/25 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    Submit Application
                  </button>
                </div>

                <div className="pt-4 text-center">
                  <p className="text-gray-400 text-sm">
                    By submitting this form, you agree to our privacy policy and terms of service.
                  </p>
                </div>
              </form>
            </div>

            {/* Additional Information Section */}
            <div className="mt-12 bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 border border-gray-800/50 transform transition-all duration-300 hover:translate-y-[-4px] hover:bg-gray-900/90 hover:border-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/10">
              <h3 className="text-xl font-bold mb-4 text-teal-500">What Happens Next?</h3>
              <div className="space-y-3">
                <div className="flex items-start group">
                  <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5 transition-all duration-300 group-hover:bg-teal-500/30 group-hover:scale-110">
                    <span className="text-teal-500 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="text-gray-300 transition-colors duration-300 group-hover:text-white">
                      <strong className="text-teal-500">Application Review:</strong> Our team will review your application within 2-3 business days.
                    </p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5 transition-all duration-300 group-hover:bg-teal-500/30 group-hover:scale-110">
                    <span className="text-teal-500 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="text-gray-300 transition-colors duration-300 group-hover:text-white">
                      <strong className="text-teal-500">Initial Contact:</strong> If you're a good fit, we'll reach out to schedule a preliminary interview.
                    </p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5 transition-all duration-300 group-hover:bg-teal-500/30 group-hover:scale-110">
                    <span className="text-teal-500 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="text-gray-300 transition-colors duration-300 group-hover:text-white">
                      <strong className="text-teal-500">Interview Process:</strong> Meet with our team to discuss your experience and learn more about the role.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadResume