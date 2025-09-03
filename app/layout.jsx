import { Geist, Geist_Mono, Inknut_Antiqua } from "next/font/google";
import "@/components/globals.css";
import { Header } from "@/components/ui/Header";
import { ThemeProvider } from '@mui/material/styles';
import { Footer } from "@/components/ui/Footer";
import 'material-symbols';
import theme from "@/constants/theme";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported but less commonly used
  // interactiveWidget: 'resizes-visual',
}

export const metadata = {
  title: "Blaise Pascal Bloc",
  description: "Un projet qui permet de rendre la grimpe plus accessible, mieux organisée, et plus collaborative",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ scrollbarGutter: 'stable' }} id="html-root">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full`}
        style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
      >
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <main className="min-h-screen flex flex-col pt-24 md:pt-17 bg-gray-900">
              <Header />
              {children}
              <Footer />
            </main>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
