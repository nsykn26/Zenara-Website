import ImageTrailEffect from './ui/image-trail-effect'
import contest1 from '../assets/contest-1.png'
import contest2 from '../assets/contest-2.png'
import contest3 from '../assets/contest-3.png'
import contest4 from '../assets/contest-4.png'
import contest5 from '../assets/contest-5.png'
import contestMain from '../assets/contest-main.svg'

export default function Contest() {
  return (
    <section id="contest" className="contest-section w-full min-h-screen antialiased bg-(--black-color) relative py-20 px-6 contact-section">
      <div className="outer">
        <div className="inner">
          <div className="container mx-auto gap-12">
            <div className=" mb-12">
              <div className="font-bold section-heading">
                <h2>Join</h2>&nbsp;
                <h2 className="gradient-word">Our Contest</h2>
              </div>
            </div>
            
            <div className="justify-self-center text-center ">
                <ImageTrailEffect 
                  imageSources={[
                    contest1,
                    contest2,
                    contest3,
                    contest4,
                    contest5, 
                  ]}
                  content={
                    <div className="font-bold space-y-10">
                      <img src={contestMain} alt="" className="w-[40%] justify-self-center"/>
                      <h3 className="text-4xl text-white">Are you up for a challenge?</h3>
                      <p className="text-white">Showcase your UI/UX design skills and win big!</p>
                      <button className="btn-secondary px-6 py-3">
                        Learn More
                      </button>
                    </div>
                  }
                /> 
                
            </div>
                    
            
          </div>
        </div>
      </div>
    </section>
  )
}