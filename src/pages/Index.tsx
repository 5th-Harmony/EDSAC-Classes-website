import Header from "@/components/Header";
import Carousel from "@/components/Carousel";

const Index = () => {
  // Sample data for the 6 screens - easily customizable
  const carouselScreens = [
    {
      id: 1,
      title: "Featured Content",
      content: "Discover amazing features and explore our latest offerings. This is the first screen of our interactive carousel.",
      backgroundColor: "hsl(0, 0%, 8%)",
    },
    {
      id: 2,
      title: "Innovation Hub",
      content: "Experience cutting-edge technology and innovative solutions that transform your workflow.",
      backgroundColor: "hsl(220, 15%, 10%)",
    },
    {
      id: 3,
      title: "Creative Studio",
      content: "Unleash your creativity with our powerful tools and collaborative workspace environment.",
      backgroundColor: "hsl(260, 15%, 8%)",
    },
    {
      id: 4,
      title: "Data Analytics",
      content: "Advanced analytics and insights to help you make informed decisions and drive growth.",
      backgroundColor: "hsl(200, 15%, 10%)",
    },
    {
      id: 5,
      title: "Team Collaboration",
      content: "Connect and collaborate with your team members in real-time across multiple projects.",
      backgroundColor: "hsl(280, 15%, 8%)",
    },
    {
      id: 6,
      title: "Success Stories",
      content: "Read inspiring success stories and case studies from our growing community of users.",
      backgroundColor: "hsl(180, 15%, 10%)",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Welcome to ENIAC
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Explore our interactive platform with seamless navigation and beautiful animations
          </p>
        </div>
        
        <Carousel screens={carouselScreens} />
      </main>
    </div>
  );
};

export default Index;
