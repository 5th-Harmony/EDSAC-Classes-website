import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Award, Calendar } from 'lucide-react';

const GradeReport = () => {
  const grades = [
    { subject: 'Advanced Mathematics', score: 92, maxScore: 100, grade: 'A', trend: '+5', credits: 4 },
    { subject: 'Quantum Physics', score: 85, maxScore: 100, grade: 'B+', trend: '+2', credits: 3 },
    { subject: 'Computer Science', score: 88, maxScore: 100, grade: 'A-', trend: '+8', credits: 4 },
    { subject: 'Organic Chemistry', score: 76, maxScore: 100, grade: 'B', trend: '-3', credits: 3 },
  ];

  const overallGPA = 3.65;
  const totalCredits = 14;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/50 to-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Grade Report</h1>
          <p className="text-xl text-muted-foreground">Track your academic performance and progress</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Award className="h-8 w-8 mx-auto text-accent mb-2" />
              <CardTitle>Overall GPA</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-primary">{overallGPA}</div>
              <p className="text-muted-foreground">out of 4.0</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <BarChart3 className="h-8 w-8 mx-auto text-accent mb-2" />
              <CardTitle>Total Credits</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-primary">{totalCredits}</div>
              <p className="text-muted-foreground">credits earned</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-accent mb-2" />
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-emerald-400">↗</div>
              <p className="text-muted-foreground">trending up</p>
            </CardContent>
          </Card>
        </div>

        {/* Grades Table */}
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {grades.map((grade, index) => (
                <div key={index} className="p-4 border border-border/50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{grade.subject}</h3>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-primary/20 text-primary">
                        {grade.grade}
                      </Badge>
                      <span className={`text-sm px-2 py-1 rounded ${
                        grade.trend.startsWith('+') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {grade.trend}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Score: {grade.score}/{grade.maxScore}</span>
                      <span>{grade.credits} credits</span>
                    </div>
                    <Progress value={(grade.score / grade.maxScore) * 100} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GradeReport;
