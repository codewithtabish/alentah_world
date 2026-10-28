import { ArabicArticleCard } from '@/components/site/general/test/araboc-card'
import { EnglishArticleCard } from '@/components/site/general/test/englisg-card'
import { UrduArticleCard } from '@/components/site/general/test/urdu-card'
import { ModeToggle } from '@/components/site/general/theme/mode-toggle'
import FromTheEditor from '@/components/site/pages/home/from-editor'
import { HomeWrapper } from '@/components/site/pages/home/home-wrapper'
import { Button } from '@/components/ui/button'
import React, { Suspense } from 'react'

const HOMEPAGE = () => {
  return (
    <main>
        <HomeWrapper/>
          {/* Editorial letter — streams in after the main grid */}
      <Suspense fallback={null}>
        <FromTheEditor />
      </Suspense>
      
    </main>
  )
}

export default HOMEPAGE
