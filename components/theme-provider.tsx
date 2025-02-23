'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider forcedTheme="dark" attribute="class">
      {children}
    </NextThemesProvider>
  )
}
