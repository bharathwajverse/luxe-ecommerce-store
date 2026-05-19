import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 64px - 300px)' }}>
        {children}
      </main>
      <Footer />
    </>
  )
}
