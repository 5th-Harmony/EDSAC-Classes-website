import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Star, 
  MessageSquare, 
  BookOpen,
  Search,
  Clock,
  Award,
  MapPin
} from 'lucide-react';

const Teachers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const teachers = [
    {
      id: 1,
      name: 'Dr. Anita Sharma',
      subject: 'Advanced Mathematics',
      qualification: 'PhD in Applied Mathematics, IIT Delhi',
      experience: '12 years',
      rating: 4.9,
      reviews: 156,
      specializations: ['Calculus', 'Linear Algebra', 'Differential Equations'],
      email: 'anita.sharma@edsac.edu',
      phone: '+91 98765 43210',
      officeHours: 'Mon-Wed 2:00-4:00 PM',
      avatar: '👩‍🏫',
      bio: 'Dr. Sharma is a passionate educator with over a decade of experience in mathematical research and teaching. She specializes in making complex mathematical concepts accessible to students.',
      achievements: ['Best Teacher Award 2023', 'Research Excellence Award', 'Published 25+ papers'],
      location: 'Room 301, Mathematics Department'
    },
    {
      id: 2,
      name: 'Prof. Rajesh Mehta',
      subject: 'Quantum Physics',
      qualification: 'MSc Physics, IISc Bangalore',
      experience: '8 years',
      rating: 4.7,
      reviews: 98,
      specializations: ['Quantum Mechanics', 'Thermodynamics', 'Optics'],
      email: 'rajesh.mehta@edsac.edu',
      phone: '+91 87654 32109',
      officeHours: 'Tue-Thu 1:00-3:00 PM',
      avatar: '👨‍🔬',
      bio: 'Prof. Mehta brings cutting-edge research experience to the classroom, helping students understand the fascinating world of quantum physics.',
      achievements: ['Young Scientist Award', 'Innovation in Teaching', 'Guest Speaker at 10+ conferences'],
      location: 'Room 205, Physics Department'
    },
    {
      id: 3,
      name: 'Dr. Priya Patel',
      subject: 'Computer Science',
      qualification: 'PhD Computer Science, Stanford University',
      experience: '15 years',
      rating: 4.8,
      reviews: 203,
      specializations: ['Artificial Intelligence', 'Machine Learning', 'Data Structures'],
      email: 'priya.patel@edsac.edu',
      phone: '+91 76543 21098',
      officeHours: 'Mon-Fri 10:00-12:00 PM',
      avatar: '👩‍💻',
      bio: 'Dr. Patel is at the forefront of AI research and brings real-world industry experience to her teaching methodology.',
      achievements: ['Google Research Grant Recipient', 'Best CS Teacher 2022', 'Tech Innovation Award'],
      location: 'Room 401, Computer Science Department'
    }
  ];

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.specializations.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/50 to-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Your Faculty</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet our distinguished faculty members who are experts in their fields
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search teachers or subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <Card key={teacher.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto text-6xl">{teacher.avatar}</div>
                <div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {teacher.name}
                  </CardTitle>
                  <p className="text-muted-foreground font-medium">{teacher.subject}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{teacher.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({teacher.reviews} reviews)</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-accent" />
                    <span className="text-muted-foreground">{teacher.qualification}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-accent" />
                    <span className="text-muted-foreground">{teacher.experience} experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-accent" />
                    <span className="text-muted-foreground">{teacher.location}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Specializations:</p>
                  <div className="flex flex-wrap gap-1">
                    {teacher.specializations.map((spec, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" onClick={() => setSelectedTeacher(teacher)}>
                    View Profile
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <Mail className="mr-1 h-3 w-3" />
                      Email
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="mr-1 h-3 w-3" />
                      Schedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Teacher Profile Modal */}
        {selectedTeacher && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="text-center">
                <div className="text-6xl mb-4">{selectedTeacher.avatar}</div>
                <CardTitle className="text-2xl">{selectedTeacher.name}</CardTitle>
                <p className="text-muted-foreground">{selectedTeacher.subject}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="about">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="about" className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">{selectedTeacher.bio}</p>
                    <div className="space-y-2">
                      <h4 className="font-medium">Specializations:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTeacher.specializations.map((spec, index) => (
                          <Badge key={index} variant="secondary">{spec}</Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="contact" className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-accent" />
                        <span>{selectedTeacher.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-accent" />
                        <span>{selectedTeacher.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-accent" />
                        <span>Office Hours: {selectedTeacher.officeHours}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-accent" />
                        <span>{selectedTeacher.location}</span>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="achievements" className="space-y-4">
                    <div className="space-y-2">
                      {selectedTeacher.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-accent" />
                          <span>{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedTeacher(null)}>
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teachers;
