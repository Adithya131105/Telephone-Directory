import '../styles.module.css';

export const metadata = {
  title: 'Telephone Directory',
  description: 'Fullstack Telephone Directory App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
