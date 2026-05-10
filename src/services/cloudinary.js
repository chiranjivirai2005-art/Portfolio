const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export async function uploadToCloudinary(file) {
  if (!file) {
    throw new Error('No file selected for upload.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
    {
      method: 'POST',
      body: formData,
    },
  )

  if (!response.ok) {
    throw new Error('Cloudinary upload failed.')
  }

  const data = await response.json()
  return data.secure_url
}
