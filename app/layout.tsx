import "styles/tailwind.css";
import { Metadata } from "next";
import { Providers } from "app/providers";
import { Header } from "components/navigation/header";
import { Toaster } from "react-hot-toast";
import appConfig from "app.config";

const title = appConfig.appName;
const description = appConfig.description;
// const image = "https://vercel.pub/thumbnail.png";

export const metadata: Metadata = {
  title,
  description,
  icons: ["./favicon.ico"],
  openGraph: {
    title,
    description,
    // images: [image],
  },
  // twitter: {
  //   card: "summary_large_image",
  //   title,
  //   description,
  //   images: [image],
  //   creator: "@vercel",
  // },
  metadataBase: new URL("https://ibis-ai.vercel.app"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Toaster />
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
