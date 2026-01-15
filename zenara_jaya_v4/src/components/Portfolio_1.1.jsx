import InteractiveImageBentoGallery from "@/components/ui/bento-gallery"
import dynastyWebsiteImg from "../assets/dynasty-website.png"
import portfolioImg2 from "../assets/portfolio-2.jpg"

// Sample data for the image gallery
const imageItems = [
  {
    id: 1,
    title: "Dynasty Chinese Restaurant",
    desc: "2025",
    url: dynastyWebsiteImg,
    span: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    title: "Website Design",
    desc: "-",
    url: portfolioImg2,
    span: "md:col-span-2 md:row-span-2",
  },
]

export default function Portfolio() {
  return (
    <section id="portfolio" className="w-full antialiased portfolio-section bg-(--background-color) py-16">
        <div className="section-container ">
            <div className="font-bold section-heading">
              <h2>Portfolio</h2>&nbsp;
              <h2 className="gradient-word">Showcase</h2>
            </div>
        </div>
      <InteractiveImageBentoGallery
        imageItems={imageItems}
       /* description="Highlights of our latest projects" */
      />
    </section>
  )
}