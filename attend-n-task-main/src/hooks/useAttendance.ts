import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface AttendanceRecord {
  id: string;
  user_id: string;
  check_in: string;
  check_out: string | null;
  date: string;
  status: 'present' | 'absent' | 'late';
  location: string;
  total_hours: number | null;
  created_at: string;
  updated_at: string;
}

export const useAttendance = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<AttendanceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Check current attendance status on mount
  useEffect(() => {
    if (user) {
      checkTodayAttendance();
    }
  }, [user]);

  const checkTodayAttendance = async () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const { data, error } = await supabase
        .from('attendance' as any)
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (error) {
        console.error('Error checking attendance:', error);
        return;
      }

      if (data) {
        const record = data as unknown as AttendanceRecord;
        setCurrentRecord(record);
        setIsCheckedIn(!!record.check_in && !record.check_out);
      } else {
        setCurrentRecord(null);
        setIsCheckedIn(false);
      }
    } catch (error) {
      console.error('Error checking today attendance:', error);
    }
  };

  const checkIn = async () => {
    if (!user) return;

    setIsLoading(true);
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const timeString = now.toISOString();
    
    // Determine if late (after 9 AM)
    const nineAM = new Date(now);
    nineAM.setHours(9, 0, 0, 0);
    const isLate = now > nineAM;

    try {
      const { data, error } = await supabase
        .from('attendance' as any)
        .insert({
          user_id: user.id,
          check_in: timeString,
          date: today,
          status: isLate ? 'late' : 'present',
          location: 'Office' // Default location
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setCurrentRecord(data as unknown as AttendanceRecord);
      setIsCheckedIn(true);
      
      toast({
        title: "Checked In Successfully",
        description: `Welcome! You checked in at ${now.toLocaleTimeString()}`,
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to check in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkOut = async () => {
    if (!user || !currentRecord) return;

    setIsLoading(true);
    const now = new Date();
    const checkInTime = new Date(currentRecord.check_in);
    const totalHours = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

    try {
      const { data, error } = await supabase
        .from('attendance' as any)
        .update({
          check_out: now.toISOString(),
          total_hours: Math.round(totalHours * 100) / 100
        })
        .eq('id', currentRecord.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setCurrentRecord(data as unknown as AttendanceRecord);
      setIsCheckedIn(false);
      
      toast({
        title: "Checked Out Successfully",
        description: `You worked ${Math.round(totalHours * 100) / 100} hours today`,
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to check out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isCheckedIn,
    currentRecord,
    isLoading,
    checkIn,
    checkOut,
    checkTodayAttendance
  };
};