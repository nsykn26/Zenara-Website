import { useState } from 'react'
import './index.css'
import About from './components/About'
import FuturePlanning from './components/FuturePlanning_1.1'
import Portfolio from './components/Portfolio_1.1'
import Services from './components/Services'
import Contest from './components/Contest'
import Contact from './components/Contact'
import Banner from './components/Banner'
import Orb from './components/ui/Orb'
import ScrollProgress from './components/ui/ScrollProgress'
import StarsCanvas from './components/ui/StarsCanvas'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ScrollProgress />
      <div style={{ width: '100%', height: '600px', position: 'relative' }}>
        <StarsCanvas />
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>


      {/* All content with proper z-index */}
      <div className="relative z-20">
        <Banner />
        <About />
        <Services />
        <Portfolio />
        <FuturePlanning />
        <Contest />
        <Contact />
      </div>
    </>
  )
}

export default App
