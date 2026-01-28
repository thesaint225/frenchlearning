# Learn French - Teacher Platform

A comprehensive learning management system for French teachers to create lessons, assignments, and manage their classes.

## Features

- 📚 **Lesson Management**: Create video, audio, and interactive exercise lessons
- 📝 **Assignment Creation**: Build assignments with multiple lessons
- 👥 **Class Management**: Organize students into classes
- 📊 **Analytics**: Track student progress and engagement
- ✅ **Grading System**: Grade assignments and provide feedback

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Validation**: Zod
- **UI Components**: Radix UI

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd learnfrench
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy the example environment file (see [Supabase Setup Guide](./SUPABASE_SETUP.md))
   - Create `.env.local` in the project root
   - Add your Supabase credentials:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Set up the database:
   - Follow the [Supabase Setup Guide](./SUPABASE_SETUP.md) to create the required tables
   - Create the `lessons` storage bucket in Supabase

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
learnfrench/
├── app/                    # Next.js app directory
│   └── teacher/           # Teacher dashboard pages
│       ├── lessons/       # Lesson management
│       ├── assignments/   # Assignment management
│       └── classes/       # Class management
├── components/            # React components
│   └── teacher/          # Teacher-specific components
├── lib/                   # Utility functions and services
│   ├── schemas/          # Zod validation schemas
│   ├── services/         # Database and storage services
│   └── supabase/         # Supabase client configuration
└── public/               # Static assets
```

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous/public key

Optional:

- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for admin operations (server-side only)
- `STUDENT_SEED_EMAIL`, `STUDENT_SEED_PASSWORD`: Used only by `scripts/create-student-user.ts` for local/seed data. Set these in `.env.local` when running that script; use local/seed values only, never production credentials.

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed setup instructions.

## Database Schema

### Lessons Table
Stores lesson content including videos, audio files, and exercises.

### Assignments Table
Stores assignments with associated lessons, due dates, and status.

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for complete schema details.

## Development

### Scripts

To create a seed student user (e.g. for testing the student dashboard), run:

```bash
npx tsx scripts/create-student-user.ts
```

Add `STUDENT_SEED_EMAIL` and `STUDENT_SEED_PASSWORD` to `.env.local` before running; see Environment Variables above. Never commit real credentials.

### Running the Development Server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Key Features Implementation

### Lessons
- Create video lessons (upload files or use external URLs)
- Create audio lessons (upload audio files)
- Create interactive exercises (multiple choice, fill-in-the-blank, etc.)

### Assignments
- Create assignments with multiple lessons
- Set due dates and point values
- Track submission and completion rates

### File Storage
- Upload video and audio files to Supabase Storage
- Support for external URLs (YouTube, Vimeo)
- Automatic file validation and error handling

## Authentication

Currently, the application uses a placeholder teacher ID. In production, you should:

1. Set up Supabase Authentication
2. Implement user login/signup
3. Replace placeholder teacher IDs with actual user IDs from the auth context

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC

## Support

For issues and questions:
- Check the [Supabase Setup Guide](./SUPABASE_SETUP.md)
- Review Supabase documentation
- Open an issue in the repository
