import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, Clock, AlertCircle, Calendar, User, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTasks } from "@/hooks/useTasks";

const priorityColors = {
  low: "bg-success text-success-foreground",
  medium: "bg-warning text-warning-foreground",
  high: "bg-destructive text-destructive-foreground"
};

const statusColors = {
  pending: "bg-muted text-muted-foreground",
  "in_progress": "bg-info text-info-foreground",
  completed: "bg-success text-success-foreground"
};

const statusIcons = {
  pending: Clock,
  "in_progress": AlertCircle,
  completed: CheckCircle
};

export const MyTasks = () => {
  const { tasks, updateTaskStatus, isLoading } = useTasks();
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const handleStatusUpdate = async (taskId: string, newStatus: any, progress: number) => {
    await updateTaskStatus(taskId, newStatus, progress);
    setUpdateDialogOpen(false);
    setSelectedTask(null);
  };

  const getTaskCounts = () => {
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: tasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'completed').length
    };
  };

  const counts = getTaskCounts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
          <p className="text-muted-foreground">View and update your assigned tasks</p>
        </div>
      </div>

      {/* Task Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{counts.total}</div>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">{counts.pending}</div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-info">{counts.inProgress}</div>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">{counts.completed}</div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-destructive">{counts.overdue}</div>
            <p className="text-sm text-muted-foreground">Overdue</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading tasks...</div>
        ) : (
          filteredTasks.map((task) => {
            const StatusIcon = statusIcons[task.status as keyof typeof statusIcons];
            const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed';
              
            return (
              <Card key={task.id} className={`transition-shadow hover:shadow-md ${isOverdue ? 'border-destructive' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={priorityColors[task.priority]}>
                          {task.priority}
                        </Badge>
                        <Badge className={statusColors[task.status as keyof typeof statusColors]}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {task.status.replace('_', ' ')}
                        </Badge>
                        {isOverdue && (
                          <Badge variant="destructive">Overdue</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Assigned by Admin
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                    </div>
                  </div>
                  
                  <Dialog open={updateDialogOpen && selectedTask?.id === task.id} onOpenChange={setUpdateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full" 
                        variant={task.status === 'completed' ? 'secondary' : 'default'}
                        onClick={() => setSelectedTask(task)}
                      >
                        {task.status === 'completed' ? 'View Details' : 'Update Status'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Task: {task.title}</DialogTitle>
                        <DialogDescription>
                          Update the status and progress of your task
                        </DialogDescription>
                      </DialogHeader>
                      
                      <TaskUpdateForm 
                        task={task} 
                        onUpdate={handleStatusUpdate}
                        onCancel={() => {
                          setUpdateDialogOpen(false);
                          setSelectedTask(null);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            );
          })
        )}
        
        {!isLoading && filteredTasks.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No tasks found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

interface TaskUpdateFormProps {
  task: any;
  onUpdate: (taskId: string, status: any, progress: number) => void;
  onCancel: () => void;
}

const TaskUpdateForm = ({ task, onUpdate, onCancel }: TaskUpdateFormProps) => {
  const [status, setStatus] = useState(task.status);
  const [progress, setProgress] = useState(task.progress);

  const handleSubmit = () => {
    onUpdate(task.id, status, progress);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="progress">Progress: {progress}%</Label>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          Update Task
        </Button>
      </div>
    </div>
  );
};