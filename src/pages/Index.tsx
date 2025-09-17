import Header from "@/components/Header";
import Carousel from "@/components/Carousel";

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
    <div className="min-h-screen">
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
    </div>
  );
};

export default Index;
