// src/components/site/general/footer/footer-skeleton.tsx
export function FooterSkeleton() {
  return (
    <footer className="w-full border-t border-border bg-[#faf7f2] dark:bg-background pt-16 pb-8 animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          
          {/* Col 1 */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="h-10 w-40 bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="flex gap-2 mt-2">
              {[1,2,3,4,5].map(i => <div key={i} className="size-9 rounded-full bg-muted" />)}
            </div>
          </div>

          {/* Col 2 */}
          <div className="lg:col-span-3">
            <div className="h-6 w-32 bg-muted rounded mb-6" />
            <div className="flex flex-col gap-4">
              {[1,2,3,4,5].map(i => <div key={i} className="h-4 w-3/4 bg-muted rounded" />)}
            </div>
          </div>

          {/* Col 3 */}
          <div className="lg:col-span-3">
            <div className="h-6 w-40 bg-muted rounded mb-6" />
            <div className="flex flex-col gap-4">
               <div className="h-4 w-24 bg-muted rounded mb-2" />
               {[1,2,3].map(i => <div key={i} className="h-3 w-2/3 bg-muted rounded ms-4" />)}
               <div className="h-4 w-28 bg-muted rounded mb-2 mt-2" />
               {[1,2,3].map(i => <div key={i} className="h-3 w-2/3 bg-muted rounded ms-4" />)}
            </div>
          </div>

          {/* Col 4 */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div>
              <div className="h-6 w-32 bg-muted rounded mb-6" />
              <div className="flex flex-col gap-3">
                {[1,2,3,4].map(i => <div key={i} className="h-4 w-2/3 bg-muted rounded" />)}
              </div>
            </div>
            <div className="mt-4">
               <div className="h-6 w-32 bg-muted rounded mb-3" />
               <div className="h-10 w-full bg-muted rounded-full" />
            </div>
          </div>

        </div>
        <div className="h-px w-full bg-muted mb-6" />
        <div className="flex justify-between">
           <div className="h-4 w-48 bg-muted rounded" />
           <div className="flex gap-4">
             {[1,2,3,4].map(i => <div key={i} className="h-4 w-20 bg-muted rounded" />)}
           </div>
        </div>
      </div>
    </footer>
  );
}