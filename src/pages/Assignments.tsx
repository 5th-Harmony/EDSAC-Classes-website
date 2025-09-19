import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  Search,
  FileText,
  Upload,
  Download,
  Eye,
  Edit,
  Send,
  BookOpen,
  User,
  MessageSquare
} from 'lucide-react';

const Assignments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  const assignments = [
    {
      id: 1,
      title: 'Linear Algebra Problem Set',
      subject: 'Mathematics',
      instructor: 'Dr. Anita Sharma',
      dueDate: '2025-10-15',
      submittedDate: null,
      status: 'Pending',
      priority: 'High',
      description: 'Solve matrix operations, eigenvalues, and vector space problems',
      totalPoints: 100,
      earnedPoints: null,
      instructions: 'Complete all problems showing detailed work. Submit as PDF.',
      submissionType: 'File Upload',
      attachments: ['assignment_3.pdf', 'sample_solutions.pdf'],
      timeEstimate: '4-6 hours',
      rubric: [
        { criteria: 'Problem-solving approach', points: 30 },
        { criteria: 'Mathematical accuracy', points: 40 },
        { criteria: 'Clarity of presentation', points: 30 }
      ]
    },
    {
      id: 2,
      title: 'Thermodynamics Lab Report',
      subject: 'Physics',
      instructor: 'Prof. Rajesh Mehta',
      dueDate: '2025-10-20',
      submittedDate: null,
      status: 'Pending',
      priority: 'Medium',
      description: 'Analyze heat engine efficiency and write comprehensive lab report',
      totalPoints: 75,
      earnedPoints: null,
      instructions: 'Include data analysis, graphs, and conclusions. Follow lab report template.',
      submissionType: 'File Upload',
      attachments: ['lab_template.docx', 'data_sheet.xlsx'],
      timeEstimate: '3-4 hours',
      rubric: [
        { criteria: 'Data analysis', points: 25 },
        { criteria: 'Graph presentation', points: 20 },
        { criteria: 'Conclusions and discussion', points: 30 }
      ]
    },
    {
      id: 3,
      title: 'Algorithm Design Project',
      subject: 'Computer Science',
      instructor: 'Dr. Priya Patel',
      dueDate: '2025-09-25',
      submittedDate: '2025-09-23',
      status: 'Completed',
      priority: 'High',
      description: 'Design and implement efficient sorting algorithms',
      totalPoints: 150,
      earnedPoints: 142,
      grade: 'A',
      feedback: 'Excellent implementation and analysis. Minor optimization possible in merge sort.',
      instructions: 'Implement at least 3 sorting algorithms and provide complexity analysis.',
      submissionType: 'Code Submission',
      attachments: ['requirements.pdf'],
      timeEstimate: '8-10 hours',
      rubric: [
        { criteria: 'Code quality', points: 50 },
        { criteria: 'Algorithm efficiency', points: 50 },
        { criteria: 'Documentation', points: 50 }
      ]
    },
    {
      id: 4,
      title: 'Organic Synthesis Report',
      subject: 'Chemistry',
      instructor: 'Dr. Sarah Wilson',
      dueDate: '2025-09-30',
      submittedDate: '2025-09-29',
      status: 'Completed',
      priority: 'Medium',
      description: 'Design synthesis pathway for target molecule',
      totalPoints: 80,
      earnedPoints: 74,
      grade: 'B+',
      feedback: 'Good synthesis design. Consider alternative protecting groups for step 3.',
      instructions: 'Propose complete synthesis with reagents and mechanisms.',
      submissionType: 'File Upload',
      attachments: ['molecule_specs.pdf'],
      timeEstimate: '5-6 hours',
      rubric: [
        { criteria: 'Synthesis design', points: 40 },
        { criteria: 'Mechanism accuracy', points: 25 },
        { criteria: 'Reagent selection', points: 15 }
      ]
    }
  ];

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'pending' && assignment.status === 'Pending') ||
                      (activeTab === 'completed' && assignment.status === 'Completed');
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-500/20 text-amber-300';
      case 'Completed': return 'bg-emerald-500/20 text-emerald-300';
      case 'Late': return 'bg-red-500/20 text-red-300';
      default: return 'bg-muted';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500/20 text-red-300';
      case 'Medium': return 'bg-amber-500/20 text-amber-300';
      case 'Low': return 'bg-emerald-500/20 text-emerald-300';
      default: return 'bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'Completed': return <CheckCircle className="h-4 w-4" />;
      case 'Late': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/50 to-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Assignments</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Manage your assignments, track progress, and submit your work
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => {
            const daysUntilDue = getDaysUntilDue(assignment.dueDate);
            return (
              <Card key={assignment.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(assignment.status)}
                      <Badge variant="outline" className={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </div>
                    <Badge variant="outline" className={getPriorityColor(assignment.priority)}>
                      {assignment.priority}
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {assignment.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">by {assignment.instructor}</p>
                    <Badge variant="secondary" className="mt-2">
                      {assignment.subject}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {assignment.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-accent" />
                        <span>Due: {assignment.dueDate}</span>
                      </div>
                      {assignment.status === 'Pending' && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          daysUntilDue <= 1 ? 'bg-red-500/20 text-red-300' :
                          daysUntilDue <= 3 ? 'bg-amber-500/20 text-amber-300' :
                          'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {daysUntilDue > 0 ? `${daysUntilDue} days left` : 'Overdue'}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Points: {assignment.totalPoints}</span>
                      <span>Est. Time: {assignment.timeEstimate}</span>
                    </div>
                  </div>

                  {assignment.status === 'Completed' && assignment.earnedPoints && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Score: {assignment.earnedPoints}/{assignment.totalPoints}</span>
                        <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300">
                          {assignment.grade}
                        </Badge>
                      </div>
                      <Progress value={(assignment.earnedPoints / assignment.totalPoints) * 100} className="h-2" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      className="w-full"
                      onClick={() => setSelectedAssignment(assignment)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    {assignment.status === 'Pending' ? (
                      <Button variant="outline" size="sm">
                        <Edit className="mr-1 h-3 w-3" />
                        Work On
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        <Download className="mr-1 h-3 w-3" />
                        Download
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Assignment Details Modal */}
        {selectedAssignment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{selectedAssignment.title}</CardTitle>
                    <p className="text-muted-foreground mt-1">{selectedAssignment.subject} • {selectedAssignment.instructor}</p>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedAssignment(null)}>×</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="details">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="instructions">Instructions</TabsTrigger>
                    <TabsTrigger value="rubric">Rubric</TabsTrigger>
                    <TabsTrigger value="submission">Submit</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Assignment Info:</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>Due Date: {selectedAssignment.dueDate}</p>
                          <p>Total Points: {selectedAssignment.totalPoints}</p>
                          <p>Estimated Time: {selectedAssignment.timeEstimate}</p>
                          <p>Submission Type: {selectedAssignment.submissionType}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Attachments:</h4>
                        <div className="space-y-1">
                          {selectedAssignment.attachments.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <FileText className="h-4 w-4 text-accent" />
                              <span>{file}</span>
                              <Button variant="outline" size="sm">
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="leading-relaxed">{selectedAssignment.description}</p>
                  </TabsContent>
                  
                  <TabsContent value="instructions" className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Instructions:</h4>
                      <p className="leading-relaxed">{selectedAssignment.instructions}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="rubric" className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Grading Rubric:</h4>
                      {selectedAssignment.rubric.map((item, index) => (
                        <div key={index} className="flex justify-between p-3 bg-muted/30 rounded">
                          <span>{item.criteria}</span>
                          <span className="font-medium">{item.points} points</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="submission" className="space-y-4">
                    {selectedAssignment.status === 'Pending' ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Upload your submission:</label>
                          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-muted-foreground">Drag & drop your files here or click to browse</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Comments (optional):</label>
                          <Textarea placeholder="Add any comments for your instructor..." />
                        </div>
                        <Button className="w-full">
                          <Send className="mr-2 h-4 w-4" />
                          Submit Assignment
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 bg-emerald-500/20 rounded-lg">
                          <h4 className="font-medium text-emerald-300">Assignment Completed</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Submitted on {selectedAssignment.submittedDate}
                          </p>
                        </div>
                        {selectedAssignment.feedback && (
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-medium mb-2">Instructor Feedback:</h4>
                            <p className="text-sm leading-relaxed">{selectedAssignment.feedback}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;
