#OUTDATED

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

## DynamoDB Table Schema

The `TravelPlans` table has the following structure:

| Attribute | Type | Description |
|-----------|------|-------------|
| planId | String (Partition Key) | Unique identifier for the plan |
| agencyId | String (Sort Key) | Agency that owns the plan |
| name | String | Name of the travel plan |
| image | String | URL of the plan image |
| route | List<String> | Array of destinations |
| description | String | Detailed description |
| price | Number | Price in INR |
| createdAt | String | ISO timestamp of creation |
| updatedAt | String | ISO timestamp of last update |
| isActive | Boolean | Whether the plan is active |

## API Endpoints

### Get All Plans
```
GET /api/plans?agencyId={agencyId}
```

### Get Single Plan
```
GET /api/plans/{planId}?agencyId={agencyId}
```

### Create Plan
```
POST /api/plans
Body: {
  "agencyId": "string",
  "name": "string",
  "image": "string",
  "route": ["string"],
  "description": "string",
  "price": number
}
```

### Update Plan
```
PUT /api/plans/{planId}
Body: {
  "agencyId": "string",
  ...fields to update
}
```

### Delete Plan (Soft Delete)
```
DELETE /api/plans/{planId}?agencyId={agencyId}
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
