'use client'

import { useState, FormEvent, useEffect } from "react"
import Image from "next/image"
import { CONFIG } from "@/config/constants"
import { templates, getTemplateById } from "@/config/templates"
import { TemplateConfig } from "@/config/types"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Loader2 } from 'lucide-react'

export default function Home() {
  const [currentTemplate, setCurrentTemplate] = useState<TemplateConfig>(templates[0])
  const [resultImage, setResultImage] = useState<string>(currentTemplate.base.DEFAULT_IMAGE)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setResultImage(currentTemplate.base.DEFAULT_IMAGE)
  }, [currentTemplate])

  const handleTemplateChange = (templateId: string) => {
    const template = getTemplateById(templateId)
    if (template) {
      setCurrentTemplate(template)
    }
  }

  useEffect(() => {
    return () => {
      if (resultImage.startsWith('blob:')) {
        URL.revokeObjectURL(resultImage)
      }
    }
  }, [resultImage])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const data: Record<string, string> = {}
      const form = event.currentTarget as HTMLFormElement
      currentTemplate.fields.forEach(field => {
        if (field.type === 'hidden' && field.defaultValue) {
          data[field.id] = field.defaultValue
        } else {
          const element = form.elements.namedItem(field.id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
          if (element && 'value' in element) {
            data[field.id] = element.value
          }
        }
      })

      const validationErrors: string[] = []
      currentTemplate.fields.forEach(field => {
        if (field.validation) {
          const value = data[field.id] || ''
          const { required, minLength, maxLength, pattern, customValidation } = field.validation

          if (required && !value) {
            validationErrors.push(`${field.label}是必填项`)
          }
          if (minLength && value.length < minLength) {
            validationErrors.push(`${field.label}最少需要${minLength}个字符`)
          }
          if (maxLength && value.length > maxLength) {
            validationErrors.push(`${field.label}最多允许${maxLength}个字符`)
          }
          if (pattern && !pattern.test(value)) {
            validationErrors.push(`${field.label}格式不正确`)
          }
          if (customValidation) {
            const result = customValidation(value)
            if (typeof result === 'string') {
              validationErrors.push(result)
            } else if (!result) {
              validationErrors.push(`${field.label}验证失败`)
            }
          }
        }
      })

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('\n'))
      }

      const response = await fetch(CONFIG.WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`请求失败: ${response.status} ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type')
      let result
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json()
        if (result.error) {
          throw new Error(result.error)
        }
        setResultImage(result.image_url || result.url)
      } else if (contentType && contentType.includes('image/')) {
        const blob = await response.blob()
        const imageUrl = URL.createObjectURL(blob)
        setResultImage(imageUrl)
      } else {
        throw new Error('未知的响应类型')
      }
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : '发生未知错误')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-2xl rounded-3xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-8 px-6">
            <h2 className="text-4xl font-extrabold text-white text-center">定制化图片渲染 Demo</h2>
            <p className="mt-2 text-xl text-blue-100 text-center">通过文字、图片生成您的个性化图片</p>
            <p className="mt-2 text-xl text-blue-100 text-center">海报 宣传图 信息图 证书 Banner 等</p>
            
            <nav className="mt-8 border-t border-blue-500/30 pt-6">
              <ul className="flex justify-center space-x-10 text-sm">
                {currentTemplate.navigation.map(item => (
                  <motion.li key={item.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <a href={item.href} className="text-blue-100 hover:text-white transition-colors flex items-center group">
                      <svg className="w-5 h-5 mr-2 group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="p-8 md:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-6">
                    {currentTemplate.fields.map(field => field.visible && (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2"
                      >
                        <label
                          htmlFor={field.id}
                          className="block text-sm font-medium text-gray-700"
                        >
                          {field.label}
                          {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {field.description && (
                          <p className="text-sm text-gray-500">{field.description}</p>
                        )}
                        {field.type === 'textarea' ? (
                          <textarea
                            id={field.id}
                            name={field.id}
                            rows={field.rows || 3}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-shadow duration-200 text-gray-900 ${field.className || ''}`}
                            placeholder={field.placeholder}
                            defaultValue={field.defaultValue}
                          />
                        ) : field.type === 'hidden' ? (
                          <input
                            type="hidden"
                            id={field.id}
                            name={field.id}
                            value={field.defaultValue}
                          />
                        ) : (
                          <input
                            type={field.type}
                            id={field.id}
                            name={field.id}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-shadow duration-200 text-gray-900 ${field.className || ''}`}
                            placeholder={field.placeholder}
                            defaultValue={field.defaultValue}
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    className="pt-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                          生成中...
                        </>
                      ) : '生成图片'}
                    </button>
                  </motion.div>
                </form>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-md bg-red-50 p-4 mt-4"
                    >
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            出错了
                          </h3>
                          <div className="mt-2 text-sm text-red-700">
                            <pre className="whitespace-pre-wrap">{error}</pre>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <select
                    className="block w-full rounded-md border-gray-300 pr-10 py-2 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none bg-white text-gray-900"
                    value={currentTemplate.id}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                  >
                    {templates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-[600px] rounded-lg overflow-hidden bg-gray-100 shadow-lg"
                >
                  {resultImage && (
                    <Image
                      src={resultImage}
                      alt="Generated image"
                      fill
                      className="object-contain w-full h-full"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-xl"
            >
              <div className="flex items-center space-x-4">
                <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                <p className="text-lg text-gray-700">正在生成图片...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}