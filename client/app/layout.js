import "./globals.css";

export const metadata = {
  title: "CRM CSV Importer",
  description: "Upload a CSV and import leads into CRM format",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
