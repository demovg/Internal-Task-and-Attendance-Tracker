import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, LogIn, LogOut, MapPin } from "lucide-react";
import { useAttendance } from "@/hooks/useAttendance";

export const AttendancePage = () => {
  const { isCheckedIn, currentRecord, isLoading, checkIn, checkOut } = useAttendance();

  const getCheckInTime = () => {
    if (currentRecord?.check_in) {
      return new Date(currentRecord.check_in).toLocaleTimeString();
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance</h1>
        <p className="text-muted-foreground">Check in and out for your work day</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Status</CardTitle>
            <CardDescription>Your current attendance status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center p-8">
              <div className="text-center space-y-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  isCheckedIn ? 'bg-success text-success-foreground' : 'bg-muted'
                }`}>
                  <Clock className="h-8 w-8" />
                </div>
                <div>
                  <Badge variant={isCheckedIn ? 'default' : 'secondary'}>
                    {isCheckedIn ? 'Checked In' : 'Not Checked In'}
                  </Badge>
                  {getCheckInTime() && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Since {getCheckInTime()}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={checkIn} 
                disabled={isCheckedIn || isLoading}
                className="flex-1"
              >
                <LogIn className="h-4 w-4 mr-2" />
                {isLoading ? 'Checking In...' : 'Check In'}
              </Button>
              <Button 
                onClick={checkOut} 
                disabled={!isCheckedIn || isLoading}
                variant="destructive"
                className="flex-1"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isLoading ? 'Checking Out...' : 'Check Out'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Info</CardTitle>
            <CardDescription>Current check-in location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Office - Main Building</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};