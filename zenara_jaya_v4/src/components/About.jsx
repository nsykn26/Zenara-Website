import React from 'react';
import TextScrollMarquee from './ui/TextScrollMarquee';



function About() {
  return (
    <section id="about" className="about-section antialiased w-full py-16 px-6" data-speed="0.5">
      <div className="outer">
        <div className="inner">
          <div className="container mx-auto">
            <div className="flex flex-col items-center justify-center">
              <div className="section-container mb-12">
                <div className="font-bold section-heading">
                  <h2>About</h2>&nbsp;
                  <h2 className="gradient-word">Us</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mx-auto pb-20">
                <div className="px-6 md:px-12 lg:px-24">
                  <p className="text-lg leading-relaxed">
                    We help businesses eliminate inefficiencies, reduce costs, and accelerate growth
                    through intelligent automation. Our cutting-edge AI solutions transform complex workflows
                    into streamlined, automated processes that drive real results.
                  </p>
                </div>
              </div>
              <div className="border-t border-b border-(--link-hover-color) py-7 mb-4">
                <TextScrollMarquee
                  baseVelocity={0.05}
                  direction="left"
                  className="text-3xl font-normal uppercase font-family-(--secondary-font) "
                  scrollDependent={false}
                  delay={500}
                >
                  <span className="gradient-word">Proven Expertise •</span>
                  <span className="gradient-word">End-to-End Ownership •</span>
                  <span className="gradient-word">Innovative Solutions •</span>
                  <span className="gradient-word">Scalable •</span>
                  <span className="gradient-word">Secure •</span>
                </TextScrollMarquee>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
