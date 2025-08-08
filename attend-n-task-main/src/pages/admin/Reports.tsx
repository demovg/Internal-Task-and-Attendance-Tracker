import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Download, FileText, Calendar, TrendingUp, Users, Clock } from "lucide-react";
import { useState } from "react";

const attendanceData = [
  { name: 'Jan', present: 85, absent: 15 },
  { name: 'Feb', present: 90, absent: 10 },
  { name: 'Mar', present: 88, absent: 12 },
  { name: 'Apr', present: 92, absent: 8 },
  { name: 'May', present: 87, absent: 13 },
  { name: 'Jun', present: 95, absent: 5 },
];

const taskCompletionData = [
  { name: 'Week 1', completed: 12, pending: 8, inProgress: 5 },
  { name: 'Week 2', completed: 15, pending: 6, inProgress: 4 },
  { name: 'Week 3', completed: 18, pending: 4, inProgress: 3 },
  { name: 'Week 4', completed: 20, pending: 3, inProgress: 2 },
];

const departmentData = [
  { name: 'Engineering', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Design', value: 25, color: 'hsl(var(--secondary))' },
  { name: 'Marketing', value: 20, color: 'hsl(var(--accent))' },
  { name: 'HR', value: 10, color: 'hsl(var(--muted))' },
];

const topPerformers = [
  { name: 'John Doe', completedTasks: 24, attendance: 98 },
  { name: 'Jane Smith', completedTasks: 22, attendance: 96 },
  { name: 'Mike Johnson', completedTasks: 20, attendance: 94 },
  { name: 'Sarah Wilson', completedTasks: 19, attendance: 92 },
];

export const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const handleExportReport = (type: string) => {
    // Mock export functionality
    console.log(`Exporting ${type} report for ${selectedPeriod} period`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights and analytics</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">91.2%</div>
            <p className="text-xs text-success">+2.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">348</div>
            <p className="text-xs text-success">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Working Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">7.8h</div>
            <p className="text-xs text-muted-foreground">Per day average</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">23</div>
            <p className="text-xs text-info">5 completing this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Attendance Trends
            </CardTitle>
            <CardDescription>Monthly attendance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" fill="hsl(var(--primary))" name="Present" />
                <Bar dataKey="absent" fill="hsl(var(--destructive))" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Completion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Task Completion Trends
            </CardTitle>
            <CardDescription>Weekly task progress</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={taskCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="completed" stroke="hsl(var(--success))" name="Completed" />
                <Line type="monotone" dataKey="inProgress" stroke="hsl(var(--warning))" name="In Progress" />
                <Line type="monotone" dataKey="pending" stroke="hsl(var(--destructive))" name="Pending" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Employee distribution by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Based on task completion and attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={performer.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{performer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {performer.completedTasks} tasks completed
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {performer.attendance}% attendance
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Reports
          </CardTitle>
          <CardDescription>Generate and download detailed reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => handleExportReport('attendance')}
            >
              <FileText className="h-4 w-4" />
              Attendance Report
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => handleExportReport('tasks')}
            >
              <FileText className="h-4 w-4" />
              Task Report
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => handleExportReport('performance')}
            >
              <FileText className="h-4 w-4" />
              Performance Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};