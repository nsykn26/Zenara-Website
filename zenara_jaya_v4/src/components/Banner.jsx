

export default function Banner() {
  return (
    <section className="banner-section antialiased min-h-screen w-full relative flex items-center justify-center px-6 pt-24 pb-16 -mt-150 overflow-hidden" data-speed="0.3">
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center text-center gap-8">
          <div className="w-full md:w-1/2">
            <div className="text-3xl md:text-5xl font-bold mb-6 drop-shadow-lg leading-normal">
              <h1 className="text-white">WHERE</h1> <h1 className="gradient-word">CREATIVITY</h1> <h1 className="text-white">MEETS</h1> <h1 className="gradient-word">INNOVATION</h1>
            </div>
            <div className="lg:text-center">
              <button className="btn-primary px-6 py-3">
                Learn More
              </button>
              <button className="btn-secondary px-6 py-3 ml-4">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
