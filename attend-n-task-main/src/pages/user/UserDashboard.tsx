import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckSquare, Calendar, LogIn, LogOut, AlertCircle } from "lucide-react";
import { useAttendance } from "@/hooks/useAttendance";
import { useTasks } from "@/hooks/useTasks";

export const UserDashboard = () => {
  const { isCheckedIn, currentRecord, checkIn, checkOut, isLoading: attendanceLoading } = useAttendance();
  const { tasks, updateTaskStatus, isLoading: tasksLoading } = useTasks();

  const handleCheckInOut = async () => {
    if (isCheckedIn) {
      await checkOut();
    } else {
      await checkIn();
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: 'pending' | 'in_progress' | 'completed') => {
    await updateTaskStatus(taskId, newStatus);
  };

  const getCheckInTime = () => {
    if (!currentRecord?.check_in) return null;
    return new Date(currentRecord.check_in).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const activeTasks = tasks.filter(task => task.status !== 'completed');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const todayTasks = tasks.filter(task => {
    if (!task.deadline) return false;
    const taskDate = new Date(task.deadline).toDateString();
    const today = new Date().toDateString();
    return taskDate === today;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">Here's your daily overview</p>
        </div>
        <Button 
          onClick={handleCheckInOut}
          variant={isCheckedIn ? "destructive" : "default"}
          size="lg"
          disabled={attendanceLoading}
        >
          {isCheckedIn ? (
            <>
              <LogOut className="h-4 w-4 mr-2" />
              Check Out
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4 mr-2" />
              Check In
            </>
          )}
        </Button>
      </div>

      {/* Today's Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isCheckedIn ? 'Checked In' : 'Not Checked In'}
            </div>
            <p className="text-xs text-muted-foreground">
              {getCheckInTime() && `Since ${getCheckInTime()}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeTasks.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {todayTasks.length} due today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
            <Calendar className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {completedTasks.length}/{tasks.length} tasks completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* My Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>My Tasks</CardTitle>
          <CardDescription>Your current assignments and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasksLoading ? (
              <div className="text-center py-4 text-muted-foreground">Loading tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No tasks assigned yet</div>
            ) : (
              tasks.slice(0, 3).map((task) => {
                const isToday = task.deadline && new Date(task.deadline).toDateString() === new Date().toDateString();
                const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed';
                
                return (
                  <div key={task.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{task.title}</h3>
                          <Badge variant={
                            task.status === 'completed' ? 'default' :
                            task.status === 'in_progress' ? 'secondary' : 'outline'
                          }>
                            {task.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant={
                            task.priority === 'high' ? 'destructive' :
                            task.priority === 'medium' ? 'default' : 'secondary'
                          }>
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className={(isToday || isOverdue) ? 'text-destructive font-medium' : ''}>
                              {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                            </span>
                            {(isToday || isOverdue) && <AlertCircle className="h-3 w-3 text-destructive" />}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {task.status !== 'completed' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                        <div className="flex gap-2">
                          {task.status === 'pending' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')}
                              disabled={tasksLoading}
                            >
                              Start Task
                            </Button>
                          )}
                          {task.status === 'in_progress' && (
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                              disabled={tasksLoading}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};