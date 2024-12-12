import type { Metadata } from "next";
import "./globals.css";
import "./css/base.css";
import "./css/embla.css";
import "react-phone-number-input/style.css";
import Provider from "./providers/Provider";

export const metadata: Metadata = {
  title: "FlowSpark Digital Marketing Solution",
  description: "MAG Full Stack Dev Assessment for Harith Onigemo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`font-sans antialiased text-text-body`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
