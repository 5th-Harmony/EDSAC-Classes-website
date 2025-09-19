import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, Star, Clock, Users, Play } from "lucide-react";
import { useState } from "react";

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const courses = [
    {
      id: 1,
      title: "Advanced React Development",
      instructor: "Dr. Sarah Johnson",
      rating: 4.8,
      students: 1250,
      duration: "12 weeks",
      category: "Programming",
      difficulty: "Advanced",
      price: "$199",
      image: "/placeholder.svg",
      description: "Master advanced React patterns and build scalable applications"
    },
    {
      id: 2,
      title: "Machine Learning Fundamentals",
      instructor: "Prof. Michael Chen",
      rating: 4.9,
      students: 890,
      duration: "8 weeks",
      category: "AI/ML",
      difficulty: "Intermediate",
      price: "$299",
      image: "/placeholder.svg",
      description: "Learn the basics of machine learning and data science"
    },
    {
      id: 3,
      title: "Web Design Mastery",
      instructor: "Emily Rodriguez",
      rating: 4.7,
      students: 2100,
      duration: "6 weeks",
      category: "Design",
      difficulty: "Beginner",
      price: "$149",
      image: "/placeholder.svg",
      description: "Create stunning websites with modern design principles"
    },
    {
      id: 4,
      title: "Data Structures & Algorithms",
      instructor: "Dr. James Wilson",
      rating: 4.9,
      students: 1500,
      duration: "10 weeks",
      category: "Computer Science",
      difficulty: "Intermediate",
      price: "$249",
      image: "/placeholder.svg",
      description: "Master fundamental computer science concepts"
    },
    {
      id: 5,
      title: "Digital Marketing Strategy",
      instructor: "Lisa Thompson",
      rating: 4.6,
      students: 750,
      duration: "4 weeks",
      category: "Marketing",
      difficulty: "Beginner",
      price: "$99",
      image: "/placeholder.svg",
      description: "Learn effective digital marketing techniques"
    },
    {
      id: 6,
      title: "Cybersecurity Essentials",
      instructor: "Robert Kumar",
      rating: 4.8,
      students: 680,
      duration: "8 weeks",
      category: "Security",
      difficulty: "Intermediate",
      price: "$299",
      image: "/placeholder.svg",
      description: "Protect systems and data from cyber threats"
    }
  ];

  const categories = ["All", "Programming", "AI/ML", "Design", "Computer Science", "Marketing", "Security"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Explore Courses</h1>
          <p className="text-xl text-muted-foreground mb-8">Discover new skills and advance your career</p>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category) => (
              <Button key={category} variant="outline" size="sm">
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="group hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">{course.difficulty}</Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Button size="sm" className="gap-2">
                      <Play className="h-4 w-4" />
                      Preview
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-2">
                  <Badge variant="outline" className="text-xs">
                    {course.category}
                  </Badge>
                </div>
                
                <CardTitle className="text-lg mb-2 line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="mb-4 line-clamp-2">
                  {course.description}
                </CardDescription>
                
                <div className="text-sm text-muted-foreground mb-4">
                  By {course.instructor}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{course.price}</span>
                  <Button>Enroll Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Courses
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Explore;