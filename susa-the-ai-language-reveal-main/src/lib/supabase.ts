import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Function to get download URL for installers
export async function getDownloadUrl(fileName: string): Promise<string> {
  const { data } = supabase.storage
    .from('installers')
    .getPublicUrl(fileName)
  
  return data.publicUrl
}

// Function to track downloads
export async function trackDownload(fileName: string, version: string) {
  try {
    await supabase
      .from('downloads')
      .insert([
        { 
          file_name: fileName, 
          version: version,
          downloaded_at: new Date().toISOString()
        }
      ])
  } catch (error) {
    console.error('Error tracking download:', error)
  }
}
