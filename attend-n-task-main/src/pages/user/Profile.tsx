import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Save, Edit, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";

export const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { profile, isLoading, updateProfile, uploadAvatar } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, City, State 12345",
    department: "",
    position: "",
    joinDate: "",
    bio: "Passionate software developer with experience in full-stack development.",
    skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker"],
    emergencyContact: {
      name: "Emergency Contact",
      relation: "Family",
      phone: "+1 (555) 987-6543"
    }
  });

  // Update profileData when profile changes
  useState(() => {
    if (profile && user) {
      setProfileData(prev => ({
        ...prev,
        name: profile.full_name || user.name || "",
        email: user.email || "",
        department: profile.department || user.department || "",
        position: profile.position || user.position || "",
        joinDate: profile.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : "",
      }));
    }
  });

  const handleSave = async () => {
    try {
      await updateProfile({
        full_name: profileData.name,
      });
      setIsEditing(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
    if (profile) {
      setProfileData(prev => ({
        ...prev,
        name: profile.full_name || "",
        email: user?.email || "",
        department: profile.department || "",
        position: profile.position || "",
        joinDate: profile.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : "",
      }));
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadAvatar(file);
    } catch (error) {
      // Error handled in hook
    }
  };

  const stats = {
    tasksCompleted: 156,
    attendanceRate: 94.5,
    projectsWorked: 8,
    monthsEmployed: 8
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2" disabled={isLoading}>
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="relative mx-auto">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profileData.name} />
                <AvatarFallback className="text-2xl">
                  {profileData.name.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full p-0"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </>
              )}
            </div>
            <CardTitle className="mt-4">{profileData.name}</CardTitle>
            <CardDescription>
              <Badge variant="secondary" className="mb-2">
                {user?.role === 'admin' ? 'Administrator' : 'Employee'}
              </Badge>
              <p>{profileData.position}</p>
              <p className="text-muted-foreground">{profileData.department}</p>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{stats.tasksCompleted}</div>
                <p className="text-xs text-muted-foreground">Tasks Completed</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{stats.attendanceRate}%</div>
                <p className="text-xs text-muted-foreground">Attendance Rate</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{stats.projectsWorked}</div>
                <p className="text-xs text-muted-foreground">Projects</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{stats.monthsEmployed}</div>
                <p className="text-xs text-muted-foreground">Months Here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Your personal and professional information</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="professional">Professional</TabsTrigger>
                <TabsTrigger value="emergency">Emergency</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="joinDate">Join Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="joinDate"
                        type="date"
                        value={profileData.joinDate}
                        disabled={true}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                      rows={2}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="professional" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="department"
                        value={profileData.department}
                        disabled={true}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="position"
                        value={profileData.position}
                        disabled={true}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Skills & Technologies</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profileData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Contact HR to update your skills and technologies
                    </p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="emergency" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyName">Contact Name</Label>
                    <Input
                      id="emergencyName"
                      value={profileData.emergencyContact.name}
                      onChange={(e) => setProfileData({ 
                        ...profileData, 
                        emergencyContact: { ...profileData.emergencyContact, name: e.target.value }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="emergencyRelation">Relationship</Label>
                    <Input
                      id="emergencyRelation"
                      value={profileData.emergencyContact.relation}
                      onChange={(e) => setProfileData({ 
                        ...profileData, 
                        emergencyContact: { ...profileData.emergencyContact, relation: e.target.value }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="emergencyPhone">Phone Number</Label>
                    <Input
                      id="emergencyPhone"
                      value={profileData.emergencyContact.phone}
                      onChange={(e) => setProfileData({ 
                        ...profileData, 
                        emergencyContact: { ...profileData.emergencyContact, phone: e.target.value }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};