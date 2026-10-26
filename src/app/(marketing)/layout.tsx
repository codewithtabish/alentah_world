import { Container } from '@/components/site/general/layouts/container'
import { Navbar } from '@/components/site/general/navbar/navbar'
import React from 'react'

const MARKETINGLAYOUT = ({children}:{children:React.ReactNode}) => {
  return (
    <main>
        <Container>
          <Navbar/>
        {children}

        </Container>
      
    </main>
  )
}

export default MARKETINGLAYOUT
