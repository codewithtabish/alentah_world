import { ArabicArticleCard } from '@/components/site/general/test/araboc-card'
import { EnglishArticleCard } from '@/components/site/general/test/englisg-card'
import { UrduArticleCard } from '@/components/site/general/test/urdu-card'
import { ModeToggle } from '@/components/site/general/theme/mode-toggle'
import { Button } from '@/components/ui/button'
import React from 'react'

const HOMEPAGE = () => {
  return (
    <div>
        <ModeToggle/>
        <EnglishArticleCard/>
        <UrduArticleCard/>
        <ArabicArticleCard/>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis rerum, quaerat optio facilis pariatur quisquam illum, dolorum similique rem sapiente nihil magnam vel, id ducimus explicabo nisi animi deleniti doloremque.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis rerum, quaerat optio facilis pariatur quisquam illum, dolorum similique rem sapiente nihil magnam vel, id ducimus explicabo nisi animi deleniti doloremque.
        <hr />
        <Button>
            DATA
        </Button>
      
    </div>
  )
}

export default HOMEPAGE
