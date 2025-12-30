# Pastebin Lite

A minimal paste-sharing service built with Next.js. Create temporary pastes with optional view limits and share them with others.

## Features

- **Create Pastes**: Share code snippets and text with a simple form
- **View Limits**: Set a maximum number of views before a paste expires
- **Auto-Expiration**: Pastes automatically expire when view limit is reached
- **Simple API**: RESTful endpoints for programmatic paste management
- **XSS Protection**: HTML escaping to prevent injection attacks
- **Health Checks**: Monitoring endpoint for deployment health

## Running Locally

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Home_test
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (optional for local development):

```bash
cp .env.local.example .env.local
```

For local development without Vercel KV, the app uses in-memory storage by default.

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

## API Endpoints

### Create a Paste

**POST** `/api/pastes`

Request body:

```json
{
  "content": "Your paste content here",
  "max_views": 5
}
```

Response:

```json
{
  "id": "abc123xyz",
  "url": "http://localhost:3000/p/abc123xyz"
}
```

### Get a Paste

**GET** `/api/pastes/[id]`

Response:

```json
{
  "content": "Your paste content here",
  "remaining_views": 4
}
```

**Note:** Each GET request decrements the view count by 1. When views reach 0, the paste returns a 404 error.

### Health Check

**GET** `/api/healthz`

Response:

```json
{
  "status": "ok"
}
```

## Persistence Layer

The application uses **Vercel KV** for production data storage, with an **in-memory fallback** for local development:

- **Production**: Connects to Vercel KV via `KV_REST_API_URL` and `KV_REST_API_TOKEN` environment variables
- **Local Development**: Uses an in-memory Map for testing without external dependencies
- **Test Mode**: Set `TEST_MODE=1` to force in-memory storage

This allows development and testing without external dependencies while maintaining production-grade persistence in deployed environments.

## Technologies

- **Next.js 14**: React framework with API routes
- **TypeScript**: Type-safe development
- **Vercel KV**: Production key-value storage
- **html-escaper**: XSS prevention
- **nanoid**: URL-safe ID generation
