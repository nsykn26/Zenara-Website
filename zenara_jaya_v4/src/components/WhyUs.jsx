import TextScrollMarquee from './ui/TextScrollMarquee';

function WhyUs() {
    //const velocity = 100;
  
    return (
      <section className="why-us-section w-full antialiased relative py-16 px-6 overflow-hidden">
        <div className="container mx-auto flex flex-col items-center justify-center">
         {/*} <div className="section-container mb-8">
            <h2 className="section-heading font-bold">Why Choose Us?</h2>
          </div> */}
           <div className="border-t border-b border-[var(--white-color)] py-7 mb-4">
              <TextScrollMarquee
              baseVelocity={0.2}
              direction="left"
              className="text-3xl font-normal uppercase text-[var(--white-color)] font-family-[var(--secondary-font)]"
              scrollDependent={false}
              delay={500}
              >
              Proven Expertise • End-to-End Ownership • Innovative Solutions •', 'Scalable • Secure • Human-Centric AI •
              </TextScrollMarquee>
          </div>
         {/* <ScrollVelocity
            texts={['Proven Expertise • End-to-End Ownership • Innovative Solutions •', 'Scalable • Secure • Human-Centric AI •']} 
            velocity={velocity} 
            className="custom-scroll-text"
          /> */}
        </div>
      </section>
    );
  }
  
  export default WhyUs;