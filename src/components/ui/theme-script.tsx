import Script from 'next/script'

export function ThemeScript() {
  return (
    <Script id="theme-script" strategy="beforeInteractive">
      {`
        try {
          const theme = localStorage.getItem('theme') || 'system'
          const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
          
          if (isDark) {
            document.documentElement.classList.add('dark')
            document.documentElement.style.setProperty('color-scheme', 'dark')
          } else {
            document.documentElement.classList.remove('dark')
            document.documentElement.style.setProperty('color-scheme', 'light')
          }
        } catch (e) {}
      `}
    </Script>
  )
}
