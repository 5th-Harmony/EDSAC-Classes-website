import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Download, 
  Play, 
  Search,
  Brain,
  MessageCircle,
  Sparkles,
  Clock,
  User
} from 'lucide-react';

const Materials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [summarizerInput, setSummarizerInput] = useState('');
  const [summarizedOutput, setSummarizedOutput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'ai',
      message: "Hi there! I'm your AI Tutor. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const materials = [
    {
      id: 1,
      title: "Introduction to AI: Lecture Notes",
      description: "A comprehensive summary of core concepts and history of Artificial Intelligence.",
      type: "PDF",
      icon: FileText,
      category: "Computer Science",
      duration: "45 min read",
      difficulty: "Beginner",
      downloadCount: 1234
    },
    {
      id: 2,
      title: "Data Science Fundamentals Video",
      description: "An introductory video on data cleaning and exploratory data analysis.",
      type: "Video",
      icon: Video,
      category: "Data Science",
      duration: "1h 20min",
      difficulty: "Intermediate",
      downloadCount: 892
    },
    {
      id: 3,
      title: "Advanced Mathematics Quiz",
      description: "A comprehensive quiz to test your understanding of calculus and linear algebra.",
      type: "Quiz",
      icon: BookOpen,
      category: "Mathematics",
      duration: "30 min",
      difficulty: "Advanced",
      downloadCount: 567
    },
    {
      id: 4,
      title: "Cloud Computing Architecture",
      description: "Detailed whitepaper on cloud infrastructure and modern deployment strategies.",
      type: "PDF",
      icon: FileText,
      category: "Cloud Computing",
      duration: "1h 15min read",
      difficulty: "Advanced",
      downloadCount: 445
    },
    {
      id: 5,
      title: "Cybersecurity Best Practices",
      description: "Essential security guidelines and practices for modern applications.",
      type: "PDF",
      icon: FileText,
      category: "Security",
      duration: "35 min read",
      difficulty: "Intermediate",
      downloadCount: 789
    },
    {
      id: 6,
      title: "Python Programming Fundamentals",
      description: "Interactive tutorial covering Python basics with hands-on exercises.",
      type: "Interactive",
      icon: Play,
      category: "Programming",
      duration: "2h 30min",
      difficulty: "Beginner",
      downloadCount: 1567
    }
  ];

  const filteredMaterials = materials.filter(material =>
    material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSummarize = async () => {
    if (!summarizerInput.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSummarizedOutput(`Summary: ${summarizerInput.substring(0, 200)}...`);
      setIsLoading(false);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      role: 'user',
      message: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        role: 'ai',
        message: `I understand you're asking about "${chatInput}". Let me help you with that concept...`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-emerald-500/20 text-emerald-300';
      case 'Intermediate': return 'bg-amber-500/20 text-amber-300';
      case 'Advanced': return 'bg-red-500/20 text-red-300';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/50 to-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Learning Materials</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover comprehensive educational resources, interactive tools, and AI-powered learning assistance
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="materials">📚 Materials Library</TabsTrigger>
            <TabsTrigger value="ai-tools">✨ AI Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="space-y-6">
            {/* Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => {
                const IconComponent = material.icon;
                return (
                  <Card key={material.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="p-3 rounded-lg bg-primary/20">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="outline" className={getDifficultyColor(material.difficulty)}>
                          {material.difficulty}
                        </Badge>
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {material.title}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-2">
                          {material.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {material.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {material.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {material.downloadCount}
                        </div>
                      </div>

                      <Button className="w-full group-hover:bg-primary/90 transition-colors">
                        {material.type === 'Video' ? (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Watch Video
                          </>
                        ) : material.type === 'Quiz' ? (
                          <>
                            <BookOpen className="mr-2 h-4 w-4" />
                            Start Quiz
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="ai-tools" className="space-y-6">
            {/* AI Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Smart Content Summarizer */}
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-accent" />
                    Smart Content Summarizer
                    <Sparkles className="h-4 w-4 text-accent" />
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Paste any lecture notes or article to get an intelligent summary
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Paste your text here for summarization..."
                    value={summarizerInput}
                    onChange={(e) => setSummarizerInput(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                  <Button 
                    onClick={handleSummarize}
                    disabled={isLoading || !summarizerInput.trim()}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent mr-2" />
                        Summarizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Summary
                      </>
                    )}
                  </Button>
                  {summarizedOutput && (
                    <div className="p-4 bg-muted/50 rounded-lg border">
                      <h4 className="font-medium mb-2">Summary:</h4>
                      <p className="text-sm text-muted-foreground">{summarizedOutput}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI Tutor Chatbot */}
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-accent" />
                    AI Tutor Assistant
                    <Sparkles className="h-4 w-4 text-accent" />
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Ask questions about any topic and get instant help
                  </p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-4">
                  <div className="flex-1 min-h-[200px] max-h-[300px] overflow-y-auto space-y-3 p-4 bg-muted/30 rounded-lg">
                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground ml-4'
                              : 'bg-accent/20 text-foreground mr-4'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-3 w-3" />
                            <span className="text-xs font-medium">
                              {msg.role === 'user' ? 'You' : 'AI Tutor'}
                            </span>
                          </div>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask me anything..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!chatInput.trim()}>
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Materials;