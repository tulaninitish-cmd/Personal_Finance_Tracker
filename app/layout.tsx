import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import ToastProvider from './../components/ToastProvider';
import NavigationWrapper from "@/components/NavigationWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50">
        <AuthProvider>
          {/* We use a Wrapper to handle the conditional logic 
              because it needs to access the current pathname.
          */}
          <NavigationWrapper>
            {children}
          </NavigationWrapper>
        </AuthProvider>
    
        <ToastProvider />       
      </body>
    </html>
  );
}