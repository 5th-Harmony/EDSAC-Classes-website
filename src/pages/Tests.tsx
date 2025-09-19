import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  Search,
  FileText,
  Timer,
  Trophy,
  BarChart3,
  BookOpen,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

const Tests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);
  const [activeTab, setActiveTab] = useState('available');

  const tests = [
    {
      id: 1,
      name: 'Advanced Calculus Midterm',
      subject: 'Mathematics',
      date: '2025-10-01',
      time: '10:00 AM',
      duration: 120,
      totalQuestions: 50,
      maxScore: 100,
      difficulty: 'Advanced',
      status: 'Available',
      description: 'Comprehensive test covering differential and integral calculus',
      topics: ['Derivatives', 'Integrals', 'Limits', 'Series'],
      attempts: 0,
      maxAttempts: 2,
      passingScore: 70
    },
    {
      id: 2,
      name: 'Quantum Physics Quiz',
      subject: 'Physics',
      date: '2025-10-05',
      time: '2:00 PM',
      duration: 60,
      totalQuestions: 25,
      maxScore: 50,
      difficulty: 'Intermediate',
      status: 'Upcoming',
      description: 'Quick assessment on quantum mechanics fundamentals',
      topics: ['Wave Functions', 'Uncertainty Principle', 'Schrödinger Equation'],
      attempts: 0,
      maxAttempts: 3,
      passingScore: 35
    },
    {
      id: 3,
      name: 'Data Structures Final',
      subject: 'Computer Science',
      date: '2025-09-28',
      time: '9:00 AM',
      duration: 180,
      totalQuestions: 75,
      maxScore: 150,
      difficulty: 'Advanced',
      status: 'Completed',
      description: 'Final examination on data structures and algorithms',
      topics: ['Arrays', 'Trees', 'Graphs', 'Sorting', 'Dynamic Programming'],
      attempts: 1,
      maxAttempts: 1,
      passingScore: 105,
      score: 142,
      grade: 'A+'
    },
    {
      id: 4,
      name: 'Organic Chemistry Practice',
      subject: 'Chemistry',
      date: '2025-10-08',
      time: '11:00 AM',
      duration: 90,
      totalQuestions: 40,
      maxScore: 80,
      difficulty: 'Intermediate',
      status: 'Available',
      description: 'Practice test for organic chemistry concepts',
      topics: ['Reactions', 'Mechanisms', 'Stereochemistry', 'Synthesis'],
      attempts: 1,
      maxAttempts: 3,
      passingScore: 56
    }
  ];

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'available' && test.status === 'Available') ||
                      (activeTab === 'upcoming' && test.status === 'Upcoming') ||
                      (activeTab === 'completed' && test.status === 'Completed');
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-emerald-500/20 text-emerald-300';
      case 'Upcoming': return 'bg-amber-500/20 text-amber-300';
      case 'Completed': return 'bg-blue-500/20 text-blue-300';
      default: return 'bg-muted';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-emerald-500/20 text-emerald-300';
      case 'Intermediate': return 'bg-amber-500/20 text-amber-300';
      case 'Advanced': return 'bg-red-500/20 text-red-300';
      default: return 'bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Available': return <Play className="h-4 w-4" />;
      case 'Upcoming': return <Clock className="h-4 w-4" />;
      case 'Completed': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/50 to-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Test Portal</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take tests, track your progress, and improve your knowledge
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="available">Available</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All Tests</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <Card key={test.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(test.status)}
                    <Badge variant="outline" className={getStatusColor(test.status)}>
                      {test.status}
                    </Badge>
                  </div>
                  <Badge variant="outline" className={getDifficultyColor(test.difficulty)}>
                    {test.difficulty}
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {test.name}
                  </CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    {test.subject}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {test.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" />
                    <span>{test.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-accent" />
                    <span>{test.duration} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-accent" />
                    <span>{test.totalQuestions} questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-accent" />
                    <span>{test.maxScore} points</span>
                  </div>
                </div>

                {test.status === 'Completed' && test.score && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Your Score: {test.score}/{test.maxScore}</span>
                      <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300">
                        {test.grade}
                      </Badge>
                    </div>
                    <Progress value={(test.score / test.maxScore) * 100} className="h-2" />
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Attempts: {test.attempts}/{test.maxAttempts}
                  </p>
                  <Progress 
                    value={(test.attempts / test.maxAttempts) * 100} 
                    className="h-1"
                  />
                </div>

                <Button 
                  className="w-full"
                  disabled={test.status === 'Upcoming' || test.attempts >= test.maxAttempts}
                  onClick={() => setSelectedTest(test)}
                >
                  {test.status === 'Available' ? 'Start Test' : 
                   test.status === 'Upcoming' ? 'Not Available Yet' : 
                   'View Results'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Test Details Modal */}
        {selectedTest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-2xl">{selectedTest.name}</CardTitle>
                <p className="text-muted-foreground">{selectedTest.subject}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <p className="leading-relaxed">{selectedTest.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Test Details:</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Duration: {selectedTest.duration} minutes</p>
                        <p>Questions: {selectedTest.totalQuestions}</p>
                        <p>Max Score: {selectedTest.maxScore}</p>
                        <p>Passing Score: {selectedTest.passingScore}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Topics Covered:</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedTest.topics.map((topic, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {selectedTest.status === 'Available' && selectedTest.attempts < selectedTest.maxAttempts && (
                    <Button className="flex-1">
                      <Play className="mr-2 h-4 w-4" />
                      Start Test
                    </Button>
                  )}
                  {selectedTest.status === 'Completed' && (
                    <Button variant="outline" className="flex-1">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Analysis
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setSelectedTest(null)}>
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

export default Tests;
