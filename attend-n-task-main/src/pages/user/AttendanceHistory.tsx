import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, Search, Filter, Download, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { exportToCSV } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  totalHours: string;
  status: 'present' | 'late' | 'absent' | 'half-day';
  location: string;
}

const statusColors = {
  present: "bg-success text-success-foreground",
  late: "bg-warning text-warning-foreground",
  absent: "bg-destructive text-destructive-foreground",
  "half-day": "bg-info text-info-foreground"
};

export const AttendanceHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchAttendanceHistory();
  }, [user]);

  const fetchAttendanceHistory = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedRecords: AttendanceRecord[] = (data || []).map(record => ({
        id: record.id,
        date: record.date,
        checkIn: record.check_in ? new Date(record.check_in).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : '-',
        checkOut: record.check_out ? new Date(record.check_out).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : '-',
        totalHours: record.total_hours ? `${record.total_hours}h` : '0h',
        status: record.status as any,
        location: record.location || 'Office'
      }));

      setRecords(formattedRecords);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch attendance history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (records.length === 0) {
      toast({
        title: "No Data",
        description: "No attendance records to export",
        variant: "destructive",
      });
      return;
    }

    exportToCSV(filteredRecords, 'attendance-history');
    toast({
      title: "Success",
      description: "Attendance history exported successfully",
    });
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.date.includes(searchTerm) || 
                         record.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculateStats = () => {
    const totalDays = records.length;
    const presentDays = records.filter(r => r.status === 'present' || r.status === 'late').length;
    const absentDays = records.filter(r => r.status === 'absent').length;
    const lateDays = records.filter(r => r.status === 'late').length;
    const totalHours = records.reduce((sum, record) => {
      const hours = parseFloat(record.totalHours.replace('h', '').replace('m', '').trim().split(' ')[0] || '0');
      return sum + hours;
    }, 0);

    return {
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      totalHours,
      attendanceRate: ((presentDays / totalDays) * 100).toFixed(1)
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance History</h1>
          <p className="text-muted-foreground">Track your attendance and working hours</p>
        </div>
        
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.presentDays} of {stats.totalDays} days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalHours}h</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.lateDays}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.absentDays}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by date or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="half-day">Half Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            Detailed view of your daily attendance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading attendance history...
                  </TableCell>
                </TableRow>
              ) : filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {record.checkIn !== "-" && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-success" />
                        {record.checkIn}
                      </div>
                    )}
                    {record.checkIn === "-" && (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {record.checkOut !== "-" && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-destructive" />
                        {record.checkOut}
                      </div>
                    )}
                    {record.checkOut === "-" && (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{record.totalHours}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[record.status]}>
                      {record.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{record.location}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {!isLoading && filteredRecords.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No attendance records found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};