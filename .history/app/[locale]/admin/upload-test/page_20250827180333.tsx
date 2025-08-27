import { Metadata } from 'next'
import { auth } from '@/auth'
import UploadTest from '@/components/shared/upload-test'

export const metadata: Metadata = {
  title: 'Upload Test - Admin',
}

const UploadTestPage = async () => {
  const session = await auth()
  if (session?.user.role !== 'Admin')
    throw new Error('Admin permission required')

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Test Uploadthing</h1>
      <UploadTest />
    </div>
  )
}

export default UploadTestPage
