import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, CheckSquare, TrendingUp, Calendar, AlertCircle } from "lucide-react";

const stats = [
  {
    title: "Total Employees",
    value: "24",
    change: "+2 this month",
    icon: Users,
    color: "text-primary"
  },
  {
    title: "Present Today",
    value: "18",
    change: "75% attendance",
    icon: Clock,
    color: "text-success"
  },
  {
    title: "Active Tasks",
    value: "45",
    change: "12 due today",
    icon: CheckSquare,
    color: "text-warning"
  },
  {
    title: "Completion Rate",
    value: "87%",
    change: "+5% vs last week",
    icon: TrendingUp,
    color: "text-info"
  }
];

const recentActivity = [
  { user: "Jane Intern", action: "Completed task: API Integration", time: "2 hours ago", type: "completed" },
  { user: "Mike Developer", action: "Checked in", time: "3 hours ago", type: "checkin" },
  { user: "Sarah Designer", action: "Updated task status", time: "4 hours ago", type: "update" },
  { user: "Tom Analyst", action: "Checked out", time: "5 hours ago", type: "checkout" },
];

const upcomingDeadlines = [
  { task: "Database Migration", assignee: "Development Team", deadline: "Today", priority: "High" },
  { task: "UI Redesign", assignee: "Design Team", deadline: "Tomorrow", priority: "Medium" },
  { task: "Testing Phase", assignee: "QA Team", deadline: "2 days", priority: "Medium" },
  { task: "Documentation", assignee: "Technical Writers", deadline: "1 week", priority: "Low" },
];

export const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor team performance and manage tasks</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Users className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest team updates and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'completed' ? 'bg-success' :
                    activity.type === 'checkin' ? 'bg-primary' :
                    activity.type === 'checkout' ? 'bg-destructive' :
                    'bg-warning'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Tasks requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{item.task}</p>
                      <Badge variant={
                        item.priority === 'High' ? 'destructive' :
                        item.priority === 'Medium' ? 'default' : 'secondary'
                      }>
                        {item.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.assignee}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.deadline}</p>
                    {item.deadline === 'Today' && (
                      <AlertCircle className="h-4 w-4 text-destructive inline" />
                    )}
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