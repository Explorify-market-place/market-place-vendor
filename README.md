# 🏢 ExplorifyTrips - Vendor Portal

> Vendor management platform for travel operators to create packages and manage scheduled departures.

## 🌐 Project Overview

This is the **vendor-facing platform** of the ExplorifyTrips ecosystem:

- **Vendor Portal**: [vendor.explorifytrips.com](https://vendor.explorifytrips.com) - This application
- **User Platform**: [explorifytrips.com](https://explorifytrips.com) - Customer-facing booking site
  - Repository: [User Platform Repo](https://github.com/yourusername/market-place-users)

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Authentication**: NextAuth.js v5
- **Database**: AWS DynamoDB (shared with user platform)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Language**: TypeScript 5

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- AWS Account with DynamoDB access
- AWS Access Keys configured

### Installation

1. **Clone and install**

   ```bash
   git clone <repository-url>
   cd market-place-vendors
   npm install
   ```

2. **Set up environment variables**

   Create `.env.local`:

   ```env
   # AWS Configuration
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key

   # DynamoDB Tables (shared with user platform)
   DYNAMODB_USERS_TABLE=Users
   DYNAMODB_PLANS_TABLE=TravelPlans
   DYNAMODB_DEPARTURES_TABLE=Departures
   DYNAMODB_BOOKINGS_TABLE=Bookings

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_here

   # OAuth (optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

3. **Initialize database**

   ```bash
   npm run init-db
   ```

   This creates Users, TravelPlans, Departures, and Bookings tables.

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 📋 Vendor Workflow

### 1. Package Template Creation

Vendors create reusable trip packages (templates):

- Trip name, description, images
- Route/destinations
- Base price per person
- Package details

### 2. Departure Scheduling

For each package, vendors schedule specific departures:

- Select departure date
- Set pickup location and time
- Define capacity (max people)
- Manage availability

### 3. Booking Management

Vendors can:

- View bookings per departure
- See capacity status (booked/available)
- Update departure details
- Manage offline bookings

## 🗄️ Database Schema

See [User Platform README](../market-place-users/README.md) for complete schema documentation.

**Key Tables:**

- **TravelPlans**: Package templates created by vendors
- **Departures**: Scheduled trips with capacity management
- **Bookings**: Customer reservations linked to departures
- **Users**: Vendor accounts (with `role: "vendor"`)

## 🔑 Authentication

- **Vendor Role Only**: This platform restricts access to users with `role: "vendor"`
- **Vendor Verification**: New vendors require admin approval (`vendorVerified: true`)
- **Auth Providers**: Google OAuth + Email/Password

## 📁 Project Structure

```
market-place-vendors/
├── app/
│   ├── api/
│   │   ├── auth/           # NextAuth routes
│   │   ├── plans/          # Package template CRUD
│   │   ├── departures/     # Departure scheduling (TODO)
│   │   ├── bookings/       # View vendor bookings
│   │   └── vendor/         # Vendor settings
│   ├── auth/               # Sign-in pages
│   ├── dashboard/          # Main vendor dashboard
│   └── settings/           # Vendor profile settings
├── components/
│   ├── dashboard/          # Dashboard components
│   │   ├── VendorDashboard.tsx
│   │   ├── TripForm.tsx
│   │   └── TripCard.tsx
│   └── ui/                 # shadcn components
├── lib/
│   ├── dynamodb.ts         # DB client & types
│   ├── db-helpers.ts       # Database operations
│   └── vendor-utils.ts     # Vendor-specific helpers
└── scripts/
    └── init-dynamodb.ts    # Database initialization
```

## 🎨 UI Components

- **Component Library**: [shadcn/ui](https://ui.shadcn.com/)
- **Theme**: Dark mode support via `next-themes`
- **Styling**: Tailwind CSS 4 with PostCSS

## 🛠️ Development Scripts

```bash
# Development with Turbopack
npm run dev

# Production build
npm run build
npm run start

# Linting
npm run lint

# Initialize DynamoDB tables
npm run init-db
```

## 🔄 Current Features

✅ Vendor authentication with role restriction  
✅ Package template management (create, edit, delete)  
✅ Vendor profile settings with bank details  
✅ View bookings for vendor's packages  
✅ Dark mode support  
⏳ Departure scheduling UI (in progress)  
⏳ Capacity management dashboard (in progress)

## 🚧 Upcoming Features

- Departure scheduling interface
- Real-time capacity tracking
- Booking analytics per departure
- Automated payout system
- Revenue reporting

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js v5](https://next-auth.js.org/)
- [AWS DynamoDB](https://docs.aws.amazon.com/dynamodb/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📄 License

Proprietary - All rights reserved

---

**For customer platform documentation**, see [market-place-users README](../market-place-users/README.md)
