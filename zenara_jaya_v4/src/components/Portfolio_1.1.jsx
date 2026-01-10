import InteractiveImageBentoGallery from "@/components/ui/bento-gallery"
import dynastyWebsiteImg from "../assets/dynasty-website.png"

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
    title: "Coastal Arch",
    desc: "Where the land meets the sea.",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
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