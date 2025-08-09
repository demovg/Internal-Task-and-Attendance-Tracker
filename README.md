# Internal Task and Attendance Tracker
![img alt align="center"](https://github.com/demovg/Internal-Task-and-Attendance-Tracker/blob/2ce6d28cd81b2cef3966dedf4577d26077ff1a8d/Time%20management%20Illustration.jpeg)


A comprehensive attendance and task management system with separate frontend and backend organization.


## 1.Project Description

* The "Internal Task and Attendance Tracker" is a secure web-based application designed to streamline task assignment, daily attendance monitoring, and progress tracking for interns and staff. It provides an efficient way for team leads and managers to allocate work, monitor task status, and generate attendance insights.

* This system is especially useful for "internship management", "team productivity tracking", and "daily workflow coordination".

## 2.Objectives
* Allow employees/interns to "check in and out" daily.
* Enable managers to "assign tasks" and track task progress.
* Provide real-time "dashboards" for both users and admins.
* Enhance "organizational efficiency" and accountability.
* Ensure "role-based access" and secure data management.

## 3.User Roles and Permissions
     Admin (Manager, Supervisor)
         * Manage users
         * Assign & monitor tasks View attendance logs
         * View statistics dashboard
         
     User (Intern, Employee)
        * Check in / check out
        * View personal attendance records
        * View and update assigned tasks
 4. Key Features
      ### Authentication & Authorization
        * Login/Logout
        * JWT-based security
        * Role-based routing (Admin/User)

      ### Attendance Module
        * Daily check-in/check-out
        * View history with date, time, and IP/Device info (optional)
        * Admin view of attendance records by user/date
     ### Task Management Module
        * Admin assigns tasks to users
        * Tasks include title, description, deadline, priority
        * Users can update task status: `Pending`, `In Progress`, `Completed`
        * Tasks visible in user dashboard
     ### Dashboard & Reports
   ## Admin:
     * Daily/weekly attendance summary
     * Task progress charts
     * Recent activity logs


## Project Structure

```
├── src/              # Frontend React application
│   ├── components/   # React components
│   ├── pages/        # Page components
│   ├── hooks/        # Custom hooks
│   ├── contexts/     # React contexts
│   ├── integrations/ # Supabase client integration
│   └── lib/          # Utility libraries
├── Back-end/         # Backend configuration
├── public/           # Static assets
├── vite.config.ts    # Build configuration
└── tailwind.config.ts # Styling configuration
```

## Technologies

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router
- shadcn-ui

### Backend

## Development

To run the development server:
```bash
npm run dev
```

The application will be available at http://localhost:8080
