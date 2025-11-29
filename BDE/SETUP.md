# BDE Dashboard Setup Guide

## Database Setup

To set up the database tables in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `database-setup.sql`
4. Paste and run the SQL script

This will create all necessary tables with proper Row Level Security policies.

## Features

- **Authentication**: Email/password authentication with Supabase
- **Lead Management**: Create, edit, and delete leads with full details
- **Activity Tracking**: Schedule and track calls, meetings, demos, proposals
- **Interactive Charts**:
  - Pie chart showing leads by status
  - Bar chart showing leads by source
  - Line chart showing monthly revenue and leads performance
- **Real-time Updates**: All changes sync with Supabase database
- **Sample Data**: Click "Load Sample Data" to populate with demo leads and activities

## Getting Started

1. Sign up or log in with demo credentials: `demo@bde.com` / `demo123`
2. Click "Load Sample Data" to populate the dashboard with sample leads and activities
3. Click "Add New" to create new leads or activities
4. Use the tabs to switch between Overview, Leads, Activities, and Analytics views
5. Click edit or delete icons on any item to manage them

## Using the Dashboard

### Overview Tab
- See key metrics at a glance
- View sales pipeline by status
- Check recent activities

### Leads Tab
- View all leads with status, value, and probability
- Edit or delete existing leads
- Create new leads

### Activities Tab
- Schedule upcoming activities
- Mark activities as complete
- Link activities to specific leads

### Analytics Tab
- View leads distribution by status (pie chart)
- Analyze leads by source (bar chart)
- Track monthly performance trends (line chart)
