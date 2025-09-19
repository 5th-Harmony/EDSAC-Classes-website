import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  Clock, 
  Calendar, 
  Search,
  BookOpen,
  Download,
  Eye,
  Star,
  Filter,
  Volume2,
  Maximize,
  SkipBack,
  SkipForward
} from 'lucide-react';

const Recordings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('all');

  const recordings = [
    {
      id: 1,
      title: 'Advanced Calculus - Derivatives and Applications',
      subject: 'Mathematics',
      instructor: 'Dr. Anita Sharma',
      date: '2025-09-10',
      duration: '1h 45m',
      views: 234,
      rating: 4.8,
      description: 'Comprehensive lecture covering derivative rules, chain rule, and real-world applications',
      thumbnail: '📊',
      topics: ['Chain Rule', 'Product Rule', 'Implicit Differentiation', 'Optimization'],
      quality: '1080p',
      size: '1.2 GB',
      watchTime: 0,
      totalDuration: 105, // minutes
      bookmarks: [
        { time: 15, title: 'Introduction to Derivatives' },
        { time: 35, title: 'Chain Rule Examples' },
        { time: 60, title: 'Real-world Applications' }
      ]
    },
    {
      id: 2,
      title: 'Quantum Mechanics - Wave Functions',
      subject: 'Physics',
      instructor: 'Prof. Rajesh Mehta',
      date: '2025-09-12',
      duration: '2h 10m',
      views: 189,
      rating: 4.9,
      description: 'Deep dive into wave functions, probability density, and the Schrödinger equation',
      thumbnail: '🌊',
      topics: ['Wave Functions', 'Probability Density', 'Schrödinger Equation', 'Quantum States'],
      quality: '1080p',
      size: '1.8 GB',
      watchTime: 45,
      totalDuration: 130,
      bookmarks: [
        { time: 20, title: 'Wave Function Basics' },
        { time: 50, title: 'Probability Interpretation' },
        { time: 90, title: 'Schrödinger Equation' }
      ]
    },
    {
      id: 3,
      title: 'Data Structures - Binary Trees and Traversals',
      subject: 'Computer Science',
      instructor: 'Dr. Priya Patel',
      date: '2025-09-15',
      duration: '1h 30m',
      views: 412,
      rating: 4.7,
      description: 'Complete guide to binary trees, tree traversals, and practical implementations',
      thumbnail: '🌳',
      topics: ['Binary Trees', 'Tree Traversals', 'BST Operations', 'Tree Algorithms'],
      quality: '1080p',
      size: '980 MB',
      watchTime: 90,
      totalDuration: 90,
      bookmarks: [
        { time: 10, title: 'Tree Fundamentals' },
        { time: 40, title: 'Traversal Methods' },
        { time: 70, title: 'Implementation Examples' }
      ]
    },
    {
      id: 4,
      title: 'Organic Chemistry - Reaction Mechanisms',
      subject: 'Chemistry',
      instructor: 'Dr. Sarah Wilson',
      date: '2025-09-18',
      duration: '1h 55m',
      views: 156,
      rating: 4.6,
      description: 'Understanding organic reaction mechanisms and electron movement',
      thumbnail: '⚛️',
      topics: ['Electron Movement', 'Nucleophilic Substitution', 'Elimination Reactions', 'Stereochemistry'],
      quality: '1080p',
      size: '1.4 GB',
      watchTime: 0,
      totalDuration: 115,
      bookmarks: [
        { time: 25, title: 'Electron Movement Basics' },
        { time: 55, title: 'SN1 vs SN2 Mechanisms' },
        { time: 85, title: 'Stereochemical Considerations' }
      ]
    }
  ];

  const subjects = ['all', ...new Set(recordings.map(r => r.subject))];

  const filteredRecordings = recordings.filter(recording => {
    const matchesSearch = recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recording.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recording.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || recording.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const getProgressPercentage = (watchTime, totalDuration) => {
    return Math.min((watchTime / totalDuration) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/50 to-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Recorded Lectures</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access comprehensive lecture recordings anytime, anywhere
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search recordings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-background border border-border rounded-md px-3 py-2"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recordings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecordings.map((recording) => (
            <Card key={recording.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="space-y-3">
                <div className="relative">
                  <div className="text-6xl text-center py-4 bg-muted/50 rounded-lg">
                    {recording.thumbnail}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {recording.duration}
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge variant="outline" className="bg-primary/20 text-primary">
                      {recording.quality}
                    </Badge>
                  </div>
                </div>
                <div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors leading-tight">
                    {recording.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm mt-1">by {recording.instructor}</p>
                  <Badge variant="secondary" className="mt-2">
                    {recording.subject}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {recording.description}
                </p>
                
                {/* Progress Bar */}
                {recording.watchTime > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{Math.round(getProgressPercentage(recording.watchTime, recording.totalDuration))}%</span>
                    </div>
                    <Progress value={getProgressPercentage(recording.watchTime, recording.totalDuration)} className="h-1" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" />
                    <span>{recording.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-accent" />
                    <span>{recording.views} views</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{recording.rating}</span>
                  <span className="text-sm text-muted-foreground">rating</span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Topics Covered:</h4>
                  <div className="flex flex-wrap gap-1">
                    {recording.topics.slice(0, 3).map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {recording.topics.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{recording.topics.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    className="w-full"
                    onClick={() => setSelectedRecording(recording)}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Watch
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-1 h-3 w-3" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Video Player Modal */}
        {selectedRecording && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg w-full max-w-4xl">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">{selectedRecording.title}</h2>
                  <Button variant="outline" onClick={() => setSelectedRecording(null)}>
                    ×
                  </Button>
                </div>
                
                {/* Video Player Placeholder */}
                <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-white">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">{selectedRecording.thumbnail}</div>
                    <div className="text-xl">Video Player</div>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm">
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm">
                        <SkipForward className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Bookmarks */}
                <div className="space-y-2">
                  <h3 className="font-medium">Quick Navigation:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecording.bookmarks.map((bookmark, index) => (
                      <Button key={index} variant="outline" size="sm">
                        {bookmark.time}m - {bookmark.title}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recordings;
