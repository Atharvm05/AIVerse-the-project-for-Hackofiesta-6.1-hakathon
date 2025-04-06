import { useState } from 'react'
import { useWeb3 } from '../context/Web3Context'

const ContributePage = () => {
  const { account } = useWeb3()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'beginner',
    content: '',
    tags: '',
  })
  const [files, setFiles] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const categories = [
    { id: 'blockchain', name: 'Blockchain Fundamentals' },
    { id: 'smart-contracts', name: 'Smart Contracts' },
    { id: 'web3', name: 'Web3 Development' },
    { id: 'defi', name: 'DeFi Protocols' },
    { id: 'nft', name: 'NFT Development' },
    { id: 'ai', name: 'AI Integration' },
  ]

  const difficultyLevels = [
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // This would normally upload to IPFS via Spheron and interact with smart contracts
      console.log('Submitting contribution:', formData)
      console.log('Files to upload:', files)

      // Simulate API call
      setTimeout(() => {
        alert('Your contribution has been submitted for review!')
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          difficulty: 'beginner',
          content: '',
          tags: '',
        })
        setFiles([])
        setIsSubmitting(false)
      }, 2000)
    } catch (error) {
      console.error('Error submitting contribution:', error)
      alert('Failed to submit contribution. Please try again.')
      setIsSubmitting(false)
    }
  }

  const togglePreview = () => {
    setPreviewMode(!previewMode)
  }

  // AI-assisted content generation
  const generateWithAI = async (type) => {
    try {
      // This would normally call the backend to use Heurist AI
      alert(`AI would generate ${type} based on your input. This feature is coming soon!`)
    } catch (error) {
      console.error('Error generating with AI:', error)
      alert('Failed to generate content with AI. Please try again.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Contribute</h1>
        <p className="text-gray-600 mt-2">
          Share your knowledge with the community and earn rewards for your contributions.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {previewMode ? 'Preview Your Contribution' : 'Create New Contribution'}
            </h2>
            <button
              type="button"
              onClick={togglePreview}
              className="btn-outline"
            >
              {previewMode ? 'Edit' : 'Preview'}
            </button>
          </div>

          {previewMode ? (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{formData.title || 'Untitled Contribution'}</h3>
                <div className="flex items-center space-x-4 mb-4">
                  {formData.category && (
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                      {categories.find(c => c.id === formData.category)?.name || formData.category}
                    </span>
                  )}
                  {formData.difficulty && (
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                      {difficultyLevels.find(d => d.id === formData.difficulty)?.name || formData.difficulty}
                    </span>
                  )}
                </div>
                <p className="text-gray-700">{formData.description || 'No description provided.'}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Content</h4>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  {formData.content ? (
                    <div className="prose max-w-none">
                      {formData.content.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No content provided.</p>
                  )}
                </div>
              </div>

              {files.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Attached Files</h4>
                  <ul className="bg-white rounded-lg p-4 border border-gray-200">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center py-2">
                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-gray-700">{file.name}</span>
                        <span className="text-gray-500 text-sm ml-2">({(file.size / 1024).toFixed(2)} KB)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {formData.tags && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.split(',').map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={togglePreview}
                  className="btn-outline mr-4"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Contribution'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="input"
                    placeholder="Enter a descriptive title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    className="input"
                    placeholder="Provide a brief description of your contribution"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      className="input"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty Level *
                    </label>
                    <select
                      id="difficulty"
                      name="difficulty"
                      className="input"
                      value={formData.difficulty}
                      onChange={handleChange}
                      required
                    >
                      {difficultyLevels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                      Content *
                    </label>
                    <button
                      type="button"
                      onClick={() => generateWithAI('content')}
                      className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate with AI
                    </button>
                  </div>
                  <textarea
                    id="content"
                    name="content"
                    rows="10"
                    className="input"
                    placeholder="Write your tutorial, code explanation, or learning module content here"
                    value={formData.content}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <p className="mt-1 text-sm text-gray-500">
                    You can use Markdown for formatting. Code blocks should be wrapped in triple backticks.
                  </p>
                </div>

                <div>
                  <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-1">
                    Attach Files (optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF, ZIP up to 10MB</p>
                    </div>
                  </div>
                  {files.length > 0 && (
                    <ul className="mt-2 divide-y divide-gray-200">
                      {files.map((file, index) => (
                        <li key={index} className="py-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-sm text-gray-500 ml-2">({(file.size / 1024).toFixed(2)} KB)</span>
                          </div>
                          <button
                            type="button"
                            className="text-sm text-red-600 hover:text-red-900"
                            onClick={() => setFiles(files.filter((_, i) => i !== index))}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                      Tags (optional)
                    </label>
                    <button
                      type="button"
                      onClick={() => generateWithAI('tags')}
                      className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Suggest Tags
                    </button>
                  </div>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    className="input"
                    placeholder="Enter tags separated by commas (e.g., solidity, ethereum, defi)"
                    value={formData.tags}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I confirm that this content is my original work or I have permission to share it, and I agree to the
                    <a href="#" className="text-primary-600 hover:text-primary-700"> terms and conditions</a>
                  </label>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={togglePreview}
                    className="btn-outline"
                  >
                    Preview
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Contribution'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* AI-Powered Assistance */}
      <div className="mt-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 border border-primary-100">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-primary-100 rounded-full p-3">
            <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">AI-Powered Content Assistance</h3>
            <p className="text-gray-700 mt-1">
              Our AI can help you create better content by generating explanations, code examples, quiz questions, and more.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => generateWithAI('explanation')}
                className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
              >
                Generate Explanation
              </button>
              <button
                type="button"
                onClick={() => generateWithAI('code')}
                className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
              >
                Generate Code Example
              </button>
              <button
                type="button"
                onClick={() => generateWithAI('quiz')}
                className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
              >
                Generate Quiz Questions
              </button>
              <button
                type="button"
                onClick={() => generateWithAI('summary')}
                className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
              >
                Generate Summary
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContributePage