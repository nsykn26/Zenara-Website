import './index.css'
import { Suspense, lazy, useEffect, useState } from 'react'
import ScrollProgress from './components/ui/ScrollProgress'
import Header from './components/Header'
import CustomCursor from './components/ui/CustomCursor'

const Banner = lazy(() => import('./components/Banner'))
const About = lazy(() => import('./components/About'))
const Services = lazy(() => import('./components/Services'))
const Portfolio = lazy(() => import('./components/Portfolio_1.1'))
const FuturePlanning = lazy(() => import('./components/FuturePlanning_1.1'))
const Contest = lazy(() => import('./components/Contest'))
const Contact = lazy(() => import('./components/Contact'))
const Footer = lazy(() => import('./components/Footer'))
const RevealOnScroll = lazy(() => import('./components/ui/RevealOnScroll'))
const StarsCanvas = lazy(() => import('./components/ui/StarsCanvas'))
const Orb = lazy(() => import('./components/ui/Orb'))
function App() {
  const [isOrbActive, setIsOrbActive] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById('about')
      const footerElement = document.getElementById('footer')

      const aboutRect = aboutSection?.getBoundingClientRect()
      const footerRect = footerElement?.getBoundingClientRect()

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight

      const aboutVisible =
        !!aboutRect &&
        aboutRect.top < viewportHeight * 0.75 &&
        aboutRect.bottom > viewportHeight * 0.25

      const footerVisible =
        !!footerRect &&
        footerRect.top < viewportHeight * 0.9 &&
        footerRect.bottom > viewportHeight * 0.1

      const nearTop = window.scrollY < viewportHeight * 0.6

      setIsOrbActive(nearTop || aboutVisible || footerVisible)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Header />

      <Suspense fallback={null}>
        {isOrbActive && (
          <div style={{ width: '100%', height: '600px', position: 'relative' }}>
            <StarsCanvas />
            <Orb
              hoverIntensity={0.5}
              rotateOnHover={true}
              hue={0}
              forceHoverState={false}
            />
          </div>
        )}
      </Suspense>


      {/* All content with proper z-index */}
      <div className="relative z-20">
        <Suspense fallback={null}>
          <RevealOnScroll>
            <Banner />
          </RevealOnScroll>

          <RevealOnScroll>
            <About />
          </RevealOnScroll>

          <RevealOnScroll>
            <Services />
          </RevealOnScroll>

          <RevealOnScroll>
            <Portfolio />
          </RevealOnScroll>

          <RevealOnScroll>
            <FuturePlanning />
          </RevealOnScroll>

          <RevealOnScroll>
            <Contest />
          </RevealOnScroll>

          <RevealOnScroll>
            <Contact />
          </RevealOnScroll>
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  )
}

export default App
