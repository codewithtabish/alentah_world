import * as React from "react";
import { Container } from "@/components/site/general/layouts/container";
import { Navbar } from "@/components/site/general/navbar/navbar";

const MARKETINGLAYOUT = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Container>
        {/* 
          Wrap the Navbar in Suspense to prevent the blocking route error 
          caused by usePathname() in the client component. 
          The fallback keeps the header space reserved so nothing jumps.
        */}
        <React.Suspense fallback={<div className="h-18 w-full" />}>
          <Navbar />
        </React.Suspense>
        
        {children}
      </Container>
    </main>
  );
};

export default MARKETINGLAYOUT;