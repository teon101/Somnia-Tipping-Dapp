import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { WalletProvider } from "@/hooks/use-wallet"
import { ThemeProvider } from "@/components/theme-provider"
import { VantaSettingsProvider } from "@/hooks/use-vanta-settings"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Somnia Tipping dApp",
  description: "Send and receive STT tokens on the Somnia Testnet",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <VantaSettingsProvider>
            <WalletProvider>{children}</WalletProvider>
          </VantaSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
