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
        
        <main className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Welcome to ENIAC Classes
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore our interactive platform for education in rural schools
            </p>
          </div>
          
          <Carousel screens={carouselScreens} />
        </main>

        {/* About Section */}
        <section className="bg-muted/30 py-20 mt-20 border-t border-border/40">
          <div className="w-full max-w-7xl mx-auto px-4 lg:px-8">
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
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Get the materials</a></li>
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
