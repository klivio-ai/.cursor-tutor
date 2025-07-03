export const config = {
  // URLs de redirection selon l'environnement
  auth: {
    redirectUrl: process.env.NODE_ENV === 'production' 
      ? 'https://klivio.ai/auth/callback'
      : process.env.NEXT_PUBLIC_SITE_URL 
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
        : 'http://localhost:3000/auth/callback',
    
    siteUrl: process.env.NODE_ENV === 'production'
      ? 'https://klivio.ai'
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  },
  
  // Configuration Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
} 