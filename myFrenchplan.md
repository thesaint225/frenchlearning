---
name: Interactive French Learning App Plan
overview: A teacher-student French learning platform combining Duolingo-style gamification with LMS functionality. Teachers upload lessons (videos, interactive exercises, audio), assign homework, and grade student work. Students complete assignments and tests in an engaging, game-like interface. Web-based application with mobile-responsive design.
todos:
  - id: teacher-workflow-research
    content: Interview French teachers to understand content upload, grading, and class management workflows
    status: pending
  - id: duolingo-ux-analysis
    content: Study Duolingo's UX patterns, gamification mechanics, and visual design for inspiration
    status: pending
  - id: teacher-dashboard-wireframes
    content: Create wireframes for teacher dashboard (content upload, assignment creation, grading interface)
    status: pending
  - id: student-learning-path-wireframes
    content: Design Duolingo-style learning path visualization and lesson interaction flows
    status: pending
  - id: exercise-builder-design
    content: Design interactive exercise builder (multiple choice, fill-in-blank, matching, etc.)
    status: pending
  - id: gamification-system-design
    content: Design XP system, levels, streaks, badges, and leaderboards with specific point values
    status: pending
  - id: grading-workflow-design
    content: Map out homework/test grading process, auto-grading rules, and feedback system
    status: pending
  - id: mvp-feature-prioritization
    content: Prioritize MVP features (teacher: upload videos/audio, create exercises, grade; student: complete lessons, submit homework, take tests)
    status: pending
    dependencies:
      - teacher-workflow-research
---

# Interactive French Learning App - Comprehensive Plan

## 1. Core Vision & Target Audience

### Platform Type

**Web Application** (mobile-responsive) - Optimized for both desktop (teacher content creation) and mobile/tablet (student learning on-the-go)

### Target Users

#### Primary Users

- **Teachers**: French instructors who create and manage course content
- **Students**: Learners enrolled in teacher's classes

### Core Functionality

1. **Teacher Dashboard**: Upload lessons, create assignments, grade homework/tests
2. **Student Dashboard**: Duolingo-style learning path with teacher-assigned content
3. **Content Types**: Videos, Interactive Exercises, Audio files
4. **Assessment**: Homework assignments and tests with grading system
5. **Gamification**: Duolingo-inspired XP, streaks, levels, achievements

## 2. Platform Architecture: Teacher & Student Views

### 2.1 Teacher Dashboard Features

#### Content Management

- **Lesson Upload**:
  - Upload video files or embed YouTube/Vimeo links
  - Upload audio files (MP3, WAV)
  - Create interactive exercises (drag-drop, matching, fill-in-blank, multiple choice)
  - Organize lessons into units/modules
  - Set lesson order and prerequisites
- **Content Library**: Manage all uploaded materials, organize by topic/unit
- **Lesson Builder**: Create interactive exercises with immediate feedback

#### Assignment & Homework Management

- **Create Homework**:
  - Assign specific lessons to complete
  - Set due dates
  - Create custom exercises/questions
  - Attach files or links
- **View Submissions**: See all student homework submissions
- **Grading Interface**:
  - Auto-grade multiple choice questions
  - Manual grading for written/speaking exercises
  - Add comments and feedback
  - Return graded work to students
- **Gradebook**: Track all student grades, view analytics

#### Test Creation & Management

- **Test Builder**:
  - Create tests with various question types
  - Set time limits
  - Randomize questions (optional)
  - Set passing scores
- **Test Scheduling**: Assign tests with start/end dates
- **Test Monitoring**: View student progress during tests
- **Auto & Manual Grading**: Grade tests automatically or manually

#### Class Management

- **Student Roster**: Add/remove students, view student profiles
- **Progress Tracking**: See individual and class-wide progress
- **Announcements**: Post messages to class
- **Analytics Dashboard**: View completion rates, average scores, engagement metrics

### 2.3 Duolingo-Style Gamification

#### Core Gamification Elements

- **XP (Experience Points)**:
  - Earn XP for completing lessons
  - Earn XP for homework completion
  - Earn bonus XP for perfect scores
  - Daily XP goals
- **Levels**:
  - Level up based on total XP
  - Visual level indicator
  - Unlock new content at certain levels
- **Streaks**:
  - Daily practice streak counter
  - Streak freeze option (prevent losing streak)
  - Weekly/monthly streak rewards
  - Visual streak calendar
- **Hearts/Lives System** (Optional):
  - Lose a heart for incorrect answers
  - Regain hearts by practicing
  - Adds challenge and engagement

#### Achievements & Badges

- **Lesson Completion Badges**: Complete all lessons in a unit
- **Perfect Score Badges**: Get 100% on assignments/tests
- **Streak Badges**: 7-day, 30-day, 100-day streaks
- **Homework Master**: Complete all homework on time
- **Test Champion**: Score high on tests
- **Vocabulary Master**: Master specific vocabulary sets
- **Grammar Expert**: Excel in grammar exercises

#### Social & Competitive Elements

- **Class Leaderboard**:
  - See classmates' XP and progress
  - Optional: make private or visible to class
- **Friend System**:
  - Add classmates as friends
  - See friends' progress
  - Compete on weekly leaderboards
- **Achievement Sharing**: Share badges and milestones

#### Daily Goals & Challenges

- **Daily Goal Setting**: Set daily XP target (10, 20, 50 XP)
- **Daily Practice Reminders**: Push notifications to maintain streak
- **Weekly Challenges**: Special challenges from teacher
- **Bonus XP Events**: Special events with extra XP rewards

### 2.4 Progress Tracking & Analytics

#### Student Progress View

- **Learning Statistics**:
  - Total XP earned
  - Current level
  - Days active
  - Lessons completed
  - Average scores
- **Skill Breakdown**:
  - Vocabulary mastery
  - Grammar proficiency
  - Listening comprehension
  - Speaking accuracy (if enabled)
- **Time Spent**: Track study time per day/week
- **Weak Areas**: Identify topics needing more practice

#### Teacher Analytics Dashboard

- **Class Overview**:
  - Average completion rates
  - Average scores
  - Most/least completed lessons
- **Individual Student Reports**:
  - Detailed progress per student
  - Assignment completion rates
  - Test performance
  - Time spent on platform
- **Engagement Metrics**:
  - Daily active users
  - Lesson completion rates
  - Homework submission rates
- **Content Performance**:
  - Which lessons are most/least effective
  - Exercise difficulty analysis
  - Student feedback on content

## 3. User Experience Flows

### 3.1 Teacher Onboarding & Setup

```
Welcome Screen
    ↓
Teacher Account Creation
    ↓
Create Class
    ↓
Add Students (invite via email/code)
    ↓
Upload First Lesson (Video/Audio/Exercise)
    ↓
Create First Assignment
    ↓
Teacher Dashboard
```

### 3.2 Student Onboarding

```
Welcome Screen
    ↓
Student Account Creation / Login
    ↓
Enter Class Code (or accept invitation)
    ↓
Welcome to Class Animation
    ↓
Tutorial: How to use the app (Duolingo-style)
    ↓
First Lesson Unlocked
    ↓
Student Dashboard (Learning Path)
```

### 3.3 Student Daily Learning Flow

```
Student Dashboard
    ↓
View Learning Path (Duolingo-style tree)
    ↓
Select Available Lesson
    ↓
Lesson Content:
  - Watch Video / Listen to Audio
  - Complete Interactive Exercises
  - Get Immediate Feedback
  - Earn XP
    ↓
Lesson Complete → Unlock Next Lesson
    ↓
Check Homework Tab
    ↓
Complete Assigned Homework
    ↓
Submit Homework
    ↓
View Progress & Streak
```

### 3.4 Teacher Content Creation Flow

```
Teacher Dashboard
    ↓
Content Library
    ↓
Create New Lesson
    ↓
Choose Content Type:
  - Upload Video
  - Upload Audio
  - Create Interactive Exercise
    ↓
Add Exercise Questions:
  - Multiple Choice
  - Fill-in-Blank
  - Matching
  - Translation
  - etc.
    ↓
Set Correct Answers & Feedback
    ↓
Save Lesson
    ↓
Assign to Class (or save as draft)
```

### 3.5 Homework & Grading Flow

```
Teacher: Create Homework
    ↓
Select Lessons/Exercises
    ↓
Set Due Date
    ↓
Assign to Class
    ↓
Students: Receive Notification
    ↓
Students: Complete Homework
    ↓
Students: Submit Homework
    ↓
Teacher: View Submissions
    ↓
Teacher: Grade (Auto + Manual)
    ↓
Teacher: Add Comments/Feedback
    ↓
Teacher: Return Graded Work
    ↓
Students: View Grades & Feedback
```

### 3.6 Test Taking Flow

```
Teacher: Create Test
    ↓
Add Questions (various types)
    ↓
Set Time Limit & Schedule
    ↓
Publish Test
    ↓
Students: Receive Test Notification
    ↓
Students: Start Test (during window)
    ↓
Students: Answer Questions
    ↓
Students: Submit Test
    ↓
Teacher: Grade Test (Auto + Manual)
    ↓
Students: View Results
```

## 4. Content Structure & Organization

### 4.1 Teacher Content Organization

#### Course Structure

- **Courses**: Top-level organization (e.g., "French 101", "Advanced French")
- **Units/Modules**: Thematic groupings (e.g., "Greetings", "Food & Dining")
- **Lessons**: Individual learning items within units
- **Exercises**: Interactive practice within lessons

#### Content Types Supported

- **Videos**:
  - File upload (MP4, MOV, etc.)
  - YouTube/Vimeo embed links
  - Video player with controls
- **Audio Files**:
  - MP3, WAV uploads
  - Audio player with transcript
- **Interactive Exercises**:
  - Multiple choice
  - Fill-in-the-blank
  - Matching
  - Sentence construction
  - Translation
  - Listening comprehension
  - Image selection

### 4.2 Student Learning Path

#### Visual Organization (Duolingo-Style)

- **Learning Tree**: Horizontal/vertical path showing lesson progression
- **Unit Cards**: Colorful cards representing each unit
- **Lesson Icons**: Visual indicators for lesson type (video, audio, exercise)
- **Progress Indicators**:
  - Locked (not yet available)
  - Available (ready to start)
  - In Progress (started but not completed)
  - Completed (finished with score)
  - Mastered (completed perfectly)

#### Lesson Prerequisites

- **Linear Progression**: Complete lessons in order
- **Unlock System**: Next lesson unlocks after completing previous
- **Optional Review**: Ability to revisit completed lessons

## 5. Design Philosophy: Duolingo-Inspired UX

### 5.1 Visual Design Principles

#### Color Scheme & Aesthetics

- **Bright, Friendly Colors**: Green for success, blue for primary actions
- **Playful Typography**: Clear, readable fonts with personality
- **Smooth Animations**: - Lesson completion celebrations - XP gain animations - Streak fire animations - Level-up animations
- **Icon System**: Consistent, friendly iconography
- **Illustrations**: Engaging illustrations for empty states, achievements

#### Interface Elements

- **Large Touch Targets**: Easy to tap on mobile
- **Clear Visual Hierarchy**: Important actions stand out
- **Progress Indicators**: Always visible progress bars, percentages
- **Micro-interactions**: - Button press feedback - Swipe gestures - Pull-to-refresh - Smooth transitions

### 5.2 Engagement Mechanics

#### Immediate Gratification

- **Instant Feedback**: See results immediately after each answer
- **XP Animations**: Watch points accumulate
- **Celebration Moments**: - Lesson completion confetti - Level-up fanfare - Achievement unlocks
- **Progress Visualization**: See advancement in real-time

#### Motivation Systems

- **Streak Pressure**: Visual reminder of daily practice
- **Goal Setting**: Daily XP targets
- **Social Comparison**: Optional leaderboards
- **Achievement Collection**: Badge collection system
- **Unlock Progression**: New content unlocks as you progress

### 5.3 Learning Experience Design

#### Bite-Sized Learning

- **Short Lessons**: 5-10 minute lesson chunks
- **Quick Exercises**: 1-2 minute exercise sets
- **Flexible Pacing**: Students control their speed
- **Break Reminders**: Suggest breaks after long sessions

#### Error Handling

- **Gentle Corrections**: Friendly error messages
- **Learning from Mistakes**: Show correct answer with explanation
- **Retry Opportunities**: Allow multiple attempts
- **No Shame**: Positive framing of mistakes as learning opportunities

## 6. Development Phases

### Phase 1: MVP (Minimum Viable Product)

#### Teacher Features

- User authentication (teacher accounts)
- Class creation and student management
- Video upload/embed functionality
- Audio file upload and player
- Basic interactive exercise builder (multiple choice, fill-in-blank)
- Assignment creation and assignment to students
- Basic test creation
- Manual grading interface
- Gradebook view

#### Student Features

- User authentication (student accounts)
- Join class via code
- Duolingo-style learning path visualization
- Video lesson player
- Audio lesson player
- Interactive exercise completion
- Immediate feedback on exercises
- XP and level system
- Basic streak tracking
- Homework submission
- Test taking interface
- View grades and feedback

#### Core Gamification

- XP system
- Level progression
- Daily streaks
- Basic badges
- Progress visualization

### Phase 2: Enhanced Features

#### Teacher Enhancements

- Advanced exercise types (matching, sentence construction, translation)
- Auto-grading for multiple choice questions
- Bulk student import
- Assignment templates
- Test question randomization
- Time limits for tests
- Analytics dashboard
- Announcement system
- File attachment support for assignments

#### Student Enhancements

- Achievement system (badges)
- Class leaderboard
- Friend system
- Daily goals
- Lesson review/replay
- Homework resubmission
- Detailed progress statistics
- Study time tracking

#### UX Improvements

- Smooth animations
- Celebration effects
- Mobile optimization
- Push notifications (web)
- Email notifications

### Phase 3: Advanced Features

#### Advanced Content

- Speaking exercises (audio recording)
- Pronunciation feedback (if speech recognition added)
- Drag-and-drop exercises
- Image-based exercises
- Video with interactive subtitles
- Audio with transcript highlighting

#### Advanced Assessment

- Rubric-based grading
- Peer review system (optional)
- Plagiarism detection (for written work)
- Advanced analytics and insights
- Export grade reports

#### Social & Community

- Class discussion forums
- Student messaging (teacher-moderated)
- Group projects
- Collaborative exercises

### Phase 4: Polish & Scale

#### Performance & Optimization

- Fast loading times
- Efficient video/audio streaming
- Offline mode for students (cache lessons)
- Progressive Web App (PWA) capabilities
- Mobile app (React Native/Flutter)

#### Additional Features

- Multi-language support (for UI)
- Accessibility improvements
- Advanced reporting
- Integration with other tools (Google Classroom, etc.)
- API for third-party integrations

## 7. Key Metrics & Success Indicators

### Student Engagement

- **Daily Active Users (DAU)**: Students logging in daily
- **Retention Rates**: 7-day, 30-day student retention
- **Average Session Length**: Time spent per session
- **Streak Maintenance**: Percentage of students maintaining streaks
- **Lesson Completion Rate**: % of assigned lessons completed
- **Homework Submission Rate**: % of homework submitted on time
- **Test Completion Rate**: % of students completing tests

### Learning Effectiveness

- **Average Scores**: Overall performance on exercises/homework/tests
- **Score Improvement**: Progress over time
- **Lesson Mastery Rate**: % of lessons completed with high scores
- **Time to Complete**: Average time to complete lessons/assignments
- **Retry Rates**: How often students retry exercises (indicates difficulty)

### Teacher Usage

- **Content Creation**: Number of lessons/exercises created
- **Active Teachers**: Teachers actively using platform
- **Grading Efficiency**: Time to grade assignments
- **Feature Adoption**: Which features teachers use most

### Platform Health

- **System Performance**: Page load times, video streaming quality
- **Error Rates**: Technical issues encountered
- **User Satisfaction**: Feedback scores
- **Feature Requests**: Most requested features

## 8. Useful Resources & References

### Platform Inspiration

- **Duolingo**: - Gamification mechanics (XP, streaks, levels) - Visual learning path design - Exercise types and immediate feedback - Mobile-first UX patterns
- **Khan Academy**: - Video lesson structure - Progress tracking - Exercise system
- **Quizlet**: - Interactive exercise types - Study modes
- **Google Classroom**: - Assignment workflow - Grading interface - Class management

### Content & Data Sources

- **Tatoeba**: Example sentences with translations and audio
- **FLE.fr**: Authentic French content (literature, audio, culture)
- **BonPatron**: Grammar explanations and error feedback model
- **YouTube**: French learning channels for video content ideas

### Technical Resources

- **Web Speech API**: Browser-based speech recognition (for future speaking exercises)
- **Video.js / Plyr**: Video player libraries
- **Wavesurfer.js**: Audio waveform visualization
- **Chart.js / D3.js**: Progress visualization and analytics

### Design & UX Resources

- **Duolingo Design System**: Study their color palette, typography, animations
- **Material Design / Ant Design**: Component libraries for web apps
- **E-Learning UX Best Practices**: - Simplicity and clarity - Consistent navigation - Readable typography - Visual feedback
- **Gamification Design Patterns**: - Progress bars - Achievement systems - Leaderboards - Streak mechanics

### LMS Best Practices

- **Moodle / Canvas**: Study assignment and grading workflows
- **Edmodo**: Class management and communication features
- **Blackboard**: Test creation and proctoring features

## 9. Design Principles

### User Interface (Duolingo-Inspired)

- **Playful but Professional**: Fun, engaging design that doesn't compromise functionality
- **Color Psychology**:
  - Green for success/positive actions
  - Blue for primary actions
  - Red for errors (gentle, not harsh)
  - Warm colors for achievements
- **Typography**:
  - Clear, readable fonts
  - Appropriate sizing for all devices
  - Good contrast ratios
- **Whitespace**: Generous spacing for clarity
- **Consistency**: Uniform design language across all screens

### User Experience

#### For Students

- **Immediate Gratification**: Instant feedback and rewards
- **Clear Progress**: Always know where you are and what's next
- **Low Friction**: Easy to start a lesson, complete exercises
- **Mobile-First**: Optimized for phone/tablet use
- **Accessibility**:
  - Screen reader support
  - Keyboard navigation
  - High contrast mode
  - Adjustable text sizes

#### For Teachers

- **Efficiency**: Quick content creation and grading
- **Clarity**: Easy to see student progress and issues
- **Flexibility**: Multiple ways to create and organize content
- **Desktop-Optimized**: Full-featured interface for content creation

### Learning Experience

- **Engagement**:
  - Interactive exercises keep attention
  - Multimedia content (video/audio) breaks monotony
  - Gamification maintains motivation
- **Clear Structure**:
  - Logical lesson progression
  - Obvious next steps
  - Clear completion criteria
- **Supportive Environment**:
  - Positive reinforcement
  - Learning from mistakes
  - No pressure or shame
- **Flexible Pacing**:
  - Students control speed
  - Ability to review
  - No forced time limits (except tests)

## 10. Platform Recommendation: Web Application

### Why Web App (Not Native Mobile)

**Advantages for Teachers:**

- Easier content upload (drag-drop files, better file management)
- Larger screen for grading and content creation
- Better integration with existing workflows
- No app store approval needed for updates

**Advantages for Students:**

- Works on any device (phone, tablet, computer)
- No app installation required
- Easy sharing via links
- Progressive Web App (PWA) can feel like native app

**Mobile-Responsive Design:**

- Optimize for mobile viewing and interaction
- Touch-friendly interface
- Responsive layouts
- Can be "installed" as PWA on mobile devices

### Technical Considerations

- **Frontend**: React/Vue.js for interactive UI, responsive design
- **Backend**: Node.js/Python for API, file handling, grading logic
- **Database**: PostgreSQL/MongoDB for user data, content, grades
- **File Storage**: AWS S3/Cloudinary for videos, audio, documents
- **Video Streaming**: Optimized video delivery (HLS or adaptive streaming)
- **Real-time Updates**: WebSockets for live notifications

## 11. Next Steps for Planning

1. **User Research**:
   - Interview French teachers about workflow needs
   - Survey students about learning preferences
   - Validate Duolingo-style approach

2. **Content Strategy**:
   - Plan initial lesson structure
   - Create sample exercises
   - Design exercise templates

3. **Wireframes & Prototypes**:
   - Teacher dashboard wireframes
   - Student learning path wireframes
   - Exercise interaction prototypes
   - Mobile vs desktop layouts

4. **Technical Architecture**:
   - Choose tech stack
   - Design database schema
   - Plan file storage solution
   - API design

5. **Gamification Design**:
   - Define XP values for different actions
   - Design badge/achievement system
   - Create leaderboard rules
   - Plan streak mechanics

6. **Grading Workflow Design**:
   - Map out grading process
   - Design gradebook structure
   - Plan feedback system
   - Create grading templates

7. **MVP Feature Prioritization**:
   - Identify must-have features for launch
   - Plan phased rollout
   - Define success metrics

## 12. Detailed Exercise Types & Specifications

### 12.1 Multiple Choice Questions

**Structure:**

- Question text (can include images, audio)
- 2-6 answer options (typically 4)
- Single correct answer or multiple correct answers
- Optional: Explanation for correct/incorrect answers

**Student Experience:**

- Tap/click to select answer
- Immediate feedback (green check/red X)
- Show correct answer if wrong
- Display explanation if provided
- Earn XP based on first-try success

**Teacher Creation:**

- Rich text editor for question
- Add images/audio to question
- Add answer options
- Mark correct answer(s)
- Add explanations
- Set point value

### 12.2 Fill-in-the-Blank Exercises

**Structure:**

- Sentence or paragraph with blanks
- Correct answers (can accept multiple variations)
- Case sensitivity option
- Accent sensitivity option

**Student Experience:**

- Type answer in blank
- Real-time validation (optional)
- Submit to check
- See correct answer if wrong
- Retry option

**Teacher Creation:**

- Text editor with blank insertion
- Define correct answers
- Set matching rules (exact, case-insensitive, etc.)
- Add hints (optional)

### 12.3 Matching Exercises

**Structure:**

- Two columns of items
- Correct pairings
- Drag-and-drop or click-to-match interface

**Student Experience:**

- Drag items to match pairs
- Visual feedback during dragging
- Check button to validate
- See correct matches if wrong
- Retry option

**Teacher Creation:**

- Add items to left column
- Add items to right column
- Define correct pairings
- Set shuffle options (shuffle one or both columns)

### 12.4 Sentence Construction

**Structure:**

- Scrambled words/phrases
- Correct sentence order
- Optional: Multiple correct orders

**Student Experience:**

- Drag words to arrange sentence
- Or tap words in order
- Visual feedback
- Submit to check
- See correct order if wrong

**Teacher Creation:**

- Enter sentence
- System scrambles words
- Define correct order
- Set difficulty (add distractors)

### 12.5 Translation Exercises

**Structure:**

- Source sentence (French or English)
- Target language
- Acceptable translations (multiple variations)
- Grammar checking (optional)

**Student Experience:**

- See source sentence
- Type translation
- Submit to check
- See acceptable translations if wrong
- Grammar hints (optional)

**Teacher Creation:**

- Enter source sentence
- Define target language
- Add acceptable translations
- Set strictness level

### 12.6 Listening Comprehension

**Structure:**

- Audio file
- Questions about audio
- Transcript (optional, can be hidden)

**Student Experience:**

- Play audio (can replay)
- Answer questions
- Optional: Show transcript after answering
- Check answers

**Teacher Creation:**

- Upload audio file
- Add questions (any type)
- Optional: Add transcript
- Set number of allowed replays

### 12.7 Image Selection

**Structure:**

- Question text
- Multiple images
- Correct image(s)

**Student Experience:**

- Read question
- Tap/click correct image
- Immediate feedback
- See correct image if wrong

**Teacher Creation:**

- Add question text
- Upload images
- Mark correct image(s)
- Set layout (grid, list)

## 13. Database Schema Overview

### 13.1 Core Entities

**Users Table:**

- User ID (primary key)
- Email, password hash
- Role (teacher/student)
- Profile information
- Created date, last login

**Classes Table:**

- Class ID (primary key)
- Teacher ID (foreign key)
- Class name, description
- Class code (for joining)
- Created date

**Enrollments Table:**

- Enrollment ID (primary key)
- Student ID (foreign key)
- Class ID (foreign key)
- Enrollment date
- Status (active/inactive)

**Courses Table:**

- Course ID (primary key)
- Class ID (foreign key)
- Course name, description
- Created date

**Units Table:**

- Unit ID (primary key)
- Course ID (foreign key)
- Unit name, description
- Order/sequence
- Created date

**Lessons Table:**

- Lesson ID (primary key)
- Unit ID (foreign key)
- Lesson type (video/audio/exercise)
- Title, description
- Content (file path or embed URL)
- Order/sequence
- Prerequisites
- Created date, updated date

**Exercises Table:**

- Exercise ID (primary key)
- Lesson ID (foreign key)
- Exercise type (multiple choice, fill-blank, etc.)
- Question data (JSON)
- Correct answers (JSON)
- Point value
- Created date

**Assignments Table:**

- Assignment ID (primary key)
- Class ID (foreign key)
- Title, description
- Due date
- Created date
- Status (draft/published)

**Assignment Items Table:**

- Item ID (primary key)
- Assignment ID (foreign key)
- Lesson ID or Exercise ID
- Order/sequence

**Submissions Table:**

- Submission ID (primary key)
- Assignment ID (foreign key)
- Student ID (foreign key)
- Answers (JSON)
- Submitted date
- Status (submitted/graded)

**Grades Table:**

- Grade ID (primary key)
- Submission ID (foreign key)
- Score, max score
- Feedback (text)
- Graded by (teacher ID)
- Graded date

**Tests Table:**

- Test ID (primary key)
- Class ID (foreign key)
- Title, description
- Time limit (minutes)
- Start date, end date
- Questions (JSON)
- Created date

**Test Attempts Table:**

- Attempt ID (primary key)
- Test ID (foreign key)
- Student ID (foreign key)
- Started date, submitted date
- Answers (JSON)
- Score, max score
- Status (in-progress/completed)

**User Progress Table:**

- Progress ID (primary key)
- User ID (foreign key)
- Lesson ID (foreign key)
- Status (not started/in progress/completed/mastered)
- Score, attempts
- Last accessed date
- Completed date

**XP & Gamification Tables:**

- XP Logs: Track all XP earned
- Levels: Level definitions and requirements
- Badges: Badge definitions
- User Badges: Badges earned by users
- Streaks: Daily streak tracking

## 14. Security & Privacy Considerations

### 14.1 Authentication & Authorization

- **Secure Authentication:**
  - Password hashing (bcrypt/argon2)
  - JWT tokens for sessions
  - Two-factor authentication (optional, Phase 2+)
  - Password reset via email

- **Role-Based Access:**
  - Teachers can only access their classes
  - Students can only access enrolled classes
  - Admin role for platform management

- **Class Access Control:**
  - Class codes for joining
  - Teacher approval for enrollment (optional)
  - Invitation-only classes (optional)

### 14.2 Data Privacy

- **Student Data Protection:**
  - GDPR/COPPA compliance
  - Data encryption at rest
  - Secure data transmission (HTTPS)
  - Privacy policy and terms of service

- **Content Protection:**
  - Video/audio streaming with access control
  - Prevent downloading of teacher content (optional)
  - Watermarking (optional)

- **Test Security:**
  - Prevent copying/pasting during tests
  - Disable right-click during tests (optional)
  - Time limits enforced
  - One attempt per test (configurable)

### 14.3 File Upload Security

- **File Validation:**
  - File type checking
  - File size limits
  - Virus scanning (optional)
  - Sanitize file names

- **Storage Security:**
  - Secure file storage (S3 with encryption)
  - Access-controlled URLs
  - Expiring links for sensitive content

## 15. Detailed UI/UX Mockup Descriptions

### 15.1 Teacher Dashboard Layout

**Header:**

- Logo/Brand name
- Navigation: Dashboard, Content, Assignments, Tests, Students, Analytics
- User profile dropdown
- Notifications icon

**Main Dashboard View:**

- Quick stats cards: Total students, Active assignments, Pending grades
- Recent activity feed
- Quick actions: Create lesson, Create assignment, Create test
- Class overview cards with student count and progress

**Content Library View:**

- Filter/search bar
- Grid/list view toggle
- Course/Unit organization tree
- Lesson cards with: Thumbnail, title, type icon, student completion stats
- Create new lesson button
- Drag-and-drop reordering

**Grading Interface:**

- List of submissions with student names
- Filter by assignment, status, date
- Click to open grading panel
- Side-by-side view: Student work | Grading form
- Quick grade buttons (A, B, C, etc.)
- Comment box
- Save and return to student

### 15.2 Student Dashboard Layout

**Header (Duolingo-Style):**

- XP bar at top
- Current level indicator
- Streak counter with fire icon
- Hearts/lives (if enabled)
- Profile/leaderboard access

**Learning Path View:**

- Horizontal scrolling path (or vertical tree)
- Unit cards with progress rings
- Lesson nodes with status indicators:
  - Locked (gray, locked icon)
  - Available (colored, play icon)
  - In progress (colored with progress bar)
  - Completed (checkmark, shows score)
  - Mastered (golden, perfect score)
- Smooth animations on unlock
- Tap lesson to start

**Lesson View:**

- Full-screen or modal overlay
- Content area (video player, audio player, or exercise)
- Progress indicator (e.g., "3 of 10 exercises")
- Next/Previous navigation
- Exit button (saves progress)

**Exercise View:**

- Question displayed prominently
- Answer input area (varies by type)
- Submit/Check button
- Feedback area (appears after submission)
- Next button (appears after feedback)
- XP earned notification

**Homework Tab:**

- List of assignments
- Status badges: Not started, In progress, Submitted, Graded
- Due date countdown
- Tap to open assignment
- Submit button

**Progress Tab:**

- Statistics dashboard
- Charts: XP over time, scores, time spent
- Skill breakdown
- Badges collection
- Leaderboard (if enabled)

## 16. Cost Considerations & Infrastructure

### 16.1 Hosting & Infrastructure

**Development Phase:**

- Free tier services (Vercel, Netlify for frontend)
- Free database (Supabase, PlanetScale free tier)
- Free file storage (Cloudinary free tier)

**Production Phase:**

- Cloud hosting (AWS, Google Cloud, Azure)
- Estimated costs:
  - Server hosting: $20-100/month (scales with users)
  - Database: $25-200/month
  - File storage: $10-100/month (depends on video/audio volume)
  - CDN for media: $20-150/month
  - Email service: $10-50/month

### 16.2 Third-Party Services

- **Video Processing:**
  - Mux, Cloudflare Stream, or self-hosted
  - Cost: Pay-per-minute or monthly subscription

- **Email Service:**
  - SendGrid, Mailgun, or AWS SES
  - Cost: Free tier available, then pay-per-email

- **Analytics:**
  - Google Analytics (free) or Mixpanel
  - Cost: Free to $100+/month

### 16.3 Scaling Considerations

- **User Growth:**
  - Start with single server
  - Scale horizontally as needed
  - Use load balancers
  - Implement caching (Redis)

- **Content Delivery:**
  - CDN for static assets
  - Video streaming optimization
  - Image optimization and lazy loading

## 17. Timeline Estimates

### Phase 1: MVP Development (3-4 months)

**Month 1:**

- Week 1-2: Project setup, database design, authentication
- Week 3-4: Teacher dashboard basics, class management

**Month 2:**

- Week 1-2: Content upload (video/audio), lesson creation
- Week 3-4: Exercise builder (basic types), lesson organization

**Month 3:**

- Week 1-2: Student dashboard, learning path visualization
- Week 3-4: Exercise completion, immediate feedback, XP system

**Month 4:**

- Week 1-2: Assignment system, homework submission
- Week 3-4: Grading interface, test creation, testing & bug fixes

### Phase 2: Enhanced Features (2-3 months)

- Advanced exercise types
- Auto-grading
- Analytics dashboard
- Mobile optimization
- Animations and polish

### Phase 3: Advanced Features (2-3 months)

- Speaking exercises
- Advanced analytics
- Social features
- Performance optimizations

### Phase 4: Polish & Scale (Ongoing)

- Continuous improvements
- Feature additions based on feedback
- Scaling infrastructure
- Marketing and user acquisition

## 18. Risk Mitigation

### 18.1 Technical Risks

- **Video/Audio Streaming Issues:**
  - Mitigation: Use proven CDN services, implement fallbacks
  - Test on various devices and connections

- **Performance with Large Classes:**
  - Mitigation: Implement pagination, lazy loading, efficient queries
  - Database indexing, caching strategies

- **File Storage Costs:**
  - Mitigation: Implement file size limits, compression
  - Consider video compression, audio optimization

### 18.2 User Adoption Risks

- **Teacher Resistance to New Platform:**
  - Mitigation: Intuitive UI, comprehensive tutorials
  - Import features from existing tools
  - Provide support and training

- **Student Engagement:**
  - Mitigation: Strong gamification, regular updates
  - Teacher encouragement, clear value proposition

### 18.3 Content Quality Risks

- **Inconsistent Exercise Quality:**
  - Mitigation: Provide templates and examples
  - Quality guidelines for teachers
  - Peer review system (optional)

## 19. Success Metrics & KPIs

### 19.1 Teacher Metrics

- **Adoption Rate:** % of invited teachers who create accounts
- **Content Creation:** Average lessons/exercises per teacher
- **Active Usage:** Teachers logging in weekly
- **Feature Utilization:** Which features are used most
- **Satisfaction Score:** Teacher feedback ratings

### 19.2 Student Metrics

- **Engagement:**
  - Daily Active Users (DAU)
  - Weekly Active Users (WAU)
  - Average session length
  - Lessons completed per week

- **Learning:**
  - Average scores on exercises
  - Score improvement over time
  - Homework completion rate
  - Test pass rate

- **Retention:**
  - 7-day retention rate
  - 30-day retention rate
  - Churn rate
  - Streak maintenance rate

### 19.3 Platform Metrics

- **Performance:**
  - Page load times
  - Video streaming quality
  - Error rates
  - Uptime percentage

- **Growth:**
  - New user signups per week
  - Class creation rate
  - Content growth (lessons added)
  - User referrals

## 20. Future Enhancements (Post-MVP)

### 20.1 AI-Powered Features

- **Intelligent Feedback:**
  - AI-generated explanations for mistakes
  - Personalized study recommendations
  - Adaptive difficulty adjustment

- **Content Generation:**
  - AI-assisted exercise creation
  - Auto-generate practice questions
  - Smart content suggestions

### 20.2 Advanced Learning Features

- **Spaced Repetition:**
  - Algorithm-based review scheduling
  - Vocabulary retention system
  - Smart review reminders

- **Pronunciation Analysis:**
  - Speech recognition for pronunciation
  - Detailed feedback on pronunciation
  - Comparison with native speakers

### 20.3 Collaboration Features

- **Group Projects:**
  - Collaborative exercises
  - Peer review assignments
  - Team challenges

- **Study Groups:**
  - Student-created study groups
  - Shared flashcards
  - Group leaderboards

### 20.4 Integration Features

- **LMS Integration:**
  - Google Classroom sync
  - Canvas integration
  - Moodle compatibility
  - Grade export to SIS

- **Third-Party Content:**
  - YouTube playlist integration
  - Podcast RSS feeds
  - External resource links
  - API for content providers
