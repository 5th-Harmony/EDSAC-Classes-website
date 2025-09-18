import Header from "@/components/Header";
import Carousel from "@/components/Carousel";
import { AppSidebar } from "@/components/AppSidebar";

const Index = () => {
  // Sample data for the 6 screens - easily customizable
  const carouselScreens = [
    {
      id: 1,
      title: "Featured Content",
      content: "Discover amazing features and explore our latest offerings. All educational materials will be updated as per the latest syllabus.",
      backgroundColor: "hsl(0, 0%, 8%)",
    },
    {
      id: 2,
      title: "Courses Offered",
      content: "Experience the opportunity to learn smart with interactive programmes offered for classes 5 to 12. Courses include all available streams for the particular board.",
      backgroundColor: "hsl(220, 15%, 10%)",
    },
    {
      id: 3,
      title: "Tests & Evaluation",
      content: "Improve your academics and gain confidence with our multiple online test facilities extending from multiple choice questions to timed tests.",
      backgroundColor: "hsl(260, 15%, 8%)",
    },
    {
      id: 4,
      title: "Data Analytics",
      content: "Advanced analytics and insights to help you make informed decisions and drive growth. Helps to keep records to analyse student performances.",
      backgroundColor: "hsl(200, 15%, 10%)",
    },
    {
      id: 5,
      title: "Team Collaboration",
      content: "Connect and collaborate with your peers in real-time across multiple projects. Enables students to easily work on group projects.",
      backgroundColor: "hsl(280, 15%, 8%)",
    },
    {
      id: 6,
      title: "Road Ahead",
      content: "More features coming soon. Stay tuned.",
      backgroundColor: "hsl(180, 15%, 10%)",
    },
  ];

  return (
    <>
      <AppSidebar />
      <div className="flex-1 min-h-screen">
        <Header />
        
        <main className="container mx-auto py-12">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Welcome to ENIAC Classes
            </h1>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              Explore our interactive platform for education in rural schools
            </p>
          </div>
          
          <Carousel screens={carouselScreens} />
        </main>

        {/* About Section */}
        <section className="bg-muted py-16 mt-16">
          <div className="container mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">About</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About us</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact us</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Discover ENIAC</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Get the app</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Teach on ENIAC</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Plans and Pricing</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">ENIAC for Business</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">ENIAC Business</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Legal & Accessibility</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Accessibility statement</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy policy</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Sitemap</a></li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
