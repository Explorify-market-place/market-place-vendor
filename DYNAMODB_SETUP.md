# ✅ UPDATED - December 2025

# DynamoDB Setup for Travel Agency Marketplace

This project uses AWS DynamoDB to store travel plan data. Follow these steps to set up DynamoDB integration:

## Prerequisites

1. AWS Account with DynamoDB access
2. AWS IAM user with programmatic access
3. Node.js and npm installed

## Setup Instructions

### 1. Configure AWS Credentials

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your AWS credentials:
   - `AWS_ACCESS_KEY_ID`: Your AWS access key
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
   - `AWS_REGION`: AWS region (default: us-east-1)
   - `DYNAMODB_PLANS_TABLE`: Table name (default: TravelPlans)

### 2. Initialize DynamoDB Table

Run the initialization script to create the table and add sample data:

```bash
npm run init-db
```

This will:

- Create a DynamoDB table named "TravelPlans"
- Add sample travel plans to the table

### 3. Run the Application

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000/market` to see the travel plans dashboard.

## DynamoDB Tables

The system uses four main tables:

### 1. Users Table

| Attribute      | Type        | Description                         |
| -------------- | ----------- | ----------------------------------- |
| userId         | String (PK) | Unique user identifier              |
| email          | String      | User email                          |
| name           | String      | Display name                        |
| role           | String      | "user" \| "vendor" \| "admin"       |
| vendorVerified | Boolean     | Admin approval for vendors          |
| vendorInfo     | Object      | Organization, address, bank details |

### 2. TravelPlans Table (Package Templates)

| Attribute   | Type          | Description                 |
| ----------- | ------------- | --------------------------- |
| planId      | String (PK)   | Unique plan identifier      |
| vendorId    | String        | Owner vendor's userId       |
| name        | String        | Package name                |
| image       | String        | Main image URL              |
| route       | Array<String> | Destinations list           |
| description | String        | Full description            |
| price       | Number        | Base price per person (INR) |
| isActive    | Boolean       | Enable/disable package      |
| vendorCut   | Number        | Vendor % (default 85%)      |

### 3. Departures Table (Scheduled Trips)

| Attribute      | Type        | Description                                              |
| -------------- | ----------- | -------------------------------------------------------- |
| departureId    | String (PK) | Unique departure ID                                      |
| planId         | String      | References TravelPlans                                   |
| departureDate  | String      | ISO datetime of trip start                               |
| pickupLocation | String      | Meeting point address                                    |
| pickupTime     | String      | Pickup time (e.g., "06:00 AM")                           |
| totalCapacity  | Number      | Max people for this departure                            |
| bookedSeats    | Number      | Current bookings count                                   |
| status         | String      | "scheduled" \| "confirmed" \| "cancelled" \| "completed" |

### 4. Bookings Table

| Attribute     | Type        | Description             |
| ------------- | ----------- | ----------------------- |
| bookingId     | String (PK) | Unique booking ID       |
| planId        | String      | References TravelPlans  |
| departureId   | String      | References Departures   |
| userId        | String      | Customer who booked     |
| numPeople     | Number      | People count            |
| totalAmount   | Number      | Amount paid (INR)       |
| paymentStatus | String      | Razorpay payment status |
| refundStatus  | String      | Refund lifecycle status |

## API Endpoints

### Package Templates (Plans)

```
GET  /api/plans                    # List vendor's plans
POST /api/plans                    # Create new package
GET  /api/plans/[id]               # Get single package
PUT  /api/plans/[id]               # Update package
DELETE /api/plans/[id]             # Delete package
```

### Departures (Scheduled Trips)

```
GET  /api/departures?planId={id}   # List departures for a plan
POST /api/departures               # Schedule new departure
GET  /api/departures/[id]          # Get departure details
PUT  /api/departures/[id]          # Update departure
DELETE /api/departures/[id]        # Cancel departure
```

### Bookings

```
GET /api/bookings?vendorId={id}    # List vendor's bookings
```

### Vendor Settings

```
GET  /api/vendor/settings          # Get vendor profile
PUT  /api/vendor/settings          # Update profile/bank details
```

## Testing

To test the DynamoDB integration:

1. Check API directly:

   ```bash
   curl http://localhost:3000/api/plans?agencyId=default-agency
   ```

2. Create a new plan:
   ```bash
   curl -X POST http://localhost:3000/api/plans \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Plan",
       "route": ["City A", "City B"],
       "price": 10000,
       "description": "Test description"
     }'
   ```
