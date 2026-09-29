# ExamGuard

ExamGuard is a full-stack online examination system with timed objective tests, browser-integrity monitoring, examiner review, controlled retakes, and score publication.

## What the system does

There are two user roles:

- **Examiner:** creates and edits exams before opening, monitors integrity events, reviews every student who submitted an exam, grants eligible retakes, and publishes scores.
- **Student:** sees department-specific exams, takes a timed exam, receives monitoring warnings, receives retake/score notifications, and sees scores only after publication.

The project uses React + Vite + Tailwind CSS on the client and Node.js + Express + Prisma + SQLite on the server. Authentication uses JWT and passwords are hashed with bcrypt.

## Complete workflow

1. An examiner creates an exam with its course, department, opening/closing dates, timer, instructions, and objective questions.
2. Students in that department receive a new-exam notification. They can see the exam card but can only begin while it is open.
3. A student starts an attempt. Answers are saved as they are selected and the timer submits the exam at zero.
4. ExamGuard records meaningful integrity events such as a hidden exam tab, fullscreen exit, copy/paste/cut, DevTools shortcuts, and right-click. Normal mouse movement and generic window blur are not recorded.
5. Each violation produces an in-exam warning. On the third recorded warning, the current attempt is automatically submitted. All violations remain available to the examiner.
6. After submission, the student sees **“check back after your examiner reviews it”** instead of a score.
7. The examiner opens the exam’s **View student results** page to see submitted students, current score, violation/suspicion score, violation count, and publication state.
8. Before the closing date, an examiner may request a retake only when a complete exam duration still remains. The current attempt is reset, the student receives a notification, and the same exam card changes to **Retake available** with a **Begin retake** button.
9. The examiner can publish all outstanding scores at any time. Students receive a notification and can then view their score.
10. When the closing date passes, no further attempts or retakes are allowed. Outstanding submitted scores are automatically published the next time the relevant exam or student results are loaded.

## Data model overview

- `User` and `StudentProfile` store accounts, roles, matric number, and department.
- `Course` belongs to an examiner and groups related exams/questions.
- `Exam` stores the availability window, timer, settings, and questions.
- `StudentExam` stores one current attempt per student/exam, score, submission state, and whether the score is published.
- `Answer` stores autosaved student answers and awarded marks.
- `ViolationLog` stores each integrity event; `SuspicionSummary` stores the point total and risk level.
- `Notification` provides in-app notifications for new exams, retakes, and published scores.

## Install on Windows from scratch

### Before copying the project to Windows

Yes—delete all three `node_modules` folders before moving or zipping the project:

- `node_modules`
- `server/node_modules`
- `client/node_modules`

They contain downloaded dependencies, including native packages that may have been built for this computer's operating system. They are large and should not be transferred. **Keep** every `package.json` and `package-lock.json` file; these record the exact dependencies needed.

After opening the project on the Windows PC, run the installation commands in step 4 below. They will recreate the three folders for Windows. If you use a ZIP file, confirm that `node_modules` was excluded before copying it.

### 1. Install the prerequisites

1. Download and install [Visual Studio Code](https://code.visualstudio.com/download). During setup, select **Add to PATH** if offered.
2. Download and install [Node.js LTS](https://nodejs.org/). Use the LTS installer and keep the default options.
3. Open **PowerShell** and verify both installations:

```powershell
node --version
npm --version
```

4. Optional but recommended: install Git from [git-scm.com](https://git-scm.com/download/win), then verify with `git --version`.

### 2. Download and open the project

If the project is on GitHub:

```powershell
git clone <YOUR-REPOSITORY-URL>
cd new
code .
```

If it was sent as a ZIP file, extract it, open the extracted `new` folder in VS Code, then choose **Terminal → New Terminal**.

### 3. Configure environment files

Copy the examples in PowerShell:

```powershell
Copy-Item server\.env.example server\.env
Copy-Item client\.env.example client\.env
```

The supplied local configuration uses SQLite and the normal local URLs. Do not commit either `.env` file.

### 4. Install packages and prepare the database

Run these commands from the project root:

```powershell
npm install
cd server
npm install
npx prisma migrate deploy
npx prisma generate
npm run prisma:seed
cd ..\client
npm install
```

If your project uses the seeded data, the default accounts are:

- Examiner: `examiner@examguard.edu`
- Student: `student@examguard.edu`
- Password: `Password123!`

### 5. Start the application

Open two VS Code terminals.

Terminal 1, API:

```powershell
cd server
npm run dev
```

Terminal 2, client:

```powershell
cd client
npm run dev
```

Open the Vite URL shown in the client terminal, normally `http://localhost:5173`. The API normally runs on `http://localhost:5000`.

## Useful API routes

- `POST /api/auth/login` — sign in.
- `GET/POST/PATCH /api/exams` — list, create, and edit exams.
- `GET /api/exams/:id/results` — examiner result-review view.
- `POST /api/exams/:id/publish-scores` — publish outstanding scores.
- `POST /api/exams/:id/students/:studentId/retake` — grant an eligible retake.
- `POST /api/exams/:id/start` — begin an exam.
- `PUT /api/attempts/:attemptId/answers` — autosave an answer.
- `POST /api/attempts/:attemptId/violations` — log a monitoring event.
- `POST /api/attempts/:attemptId/submit` — submit an attempt.
- `GET /api/notifications` — retrieve in-app notifications.

## Diagram-generation prompts

Use these prompts in your preferred AI diagram tool. Ask it to export PNG/SVG for a report, or Mermaid/PlantUML when you need editable diagrams.

### Flowchart prompt

> Create a professional flowchart for “ExamGuard Online Examination System.” Show two swimlanes: Student and Examiner. Student flow: login → view department exam cards → exam open? → start timed exam → autosave answers → monitoring event? → warning count less than 3 / third warning auto-submit → submit → check back for examiner review → retake notification? → retake if before closing → score-published notification → view score. Examiner flow: login → create/edit exam before opening → view submitted students by exam → review score and violation score → publish scores or request retake if a full timer duration remains → closing date automatically publishes outstanding scores. Include branches for upcoming, closed, and unavailable retakes.

### Use-case diagram prompt

> Create a UML use-case diagram for ExamGuard with actors Student and Examiner. Student use cases: register/login, view exams, take timed exam, answer questions, receive monitoring warning, auto-submit after three warnings, receive retake notification, retake exam, receive score-published notification, view published score. Examiner use cases: login, create exam, edit unstarted exam, view exam results, view students/current scores/violation scores, view violation details, request retake, publish scores, view dashboard. Include system boundary “ExamGuard.”

### ERD prompt

> Create a crow’s-foot ERD for ExamGuard. Entities: User(id, name, email, passwordHash, role, active), StudentProfile(id, userId, matricNumber, department, level), Course(id, code, title, department, examinerId), Exam(id, title, courseId, scheduledAt, closesAt, durationMinutes, status, autoSubmitThreshold), Question(id, courseId, text, options, correctAnswer, marks), ExamQuestion(examId, questionId, position), StudentExam(id, studentId, examId, status, startedAt, submittedAt, score, scorePublished), Answer(id, attemptId, questionId, value, isCorrect, awardedMarks), ViolationLog(id, attemptId, type, description, points, createdAt), SuspicionSummary(id, attemptId, score, riskLevel), Notification(id, userId, title, message, read, createdAt). Show PKs, FKs, and one-to-many relationships.

### Architecture diagram prompt

> Create a layered architecture diagram for ExamGuard. Client layer: React, Vite, Tailwind CSS, React Router, Axios, monitoring hook. API layer: Node.js, Express, JWT authentication middleware, role authorization, controllers, Socket.IO. Data layer: Prisma ORM and SQLite database. Show browser → Axios/REST API → Express routes/controllers → Prisma → SQLite. Show Socket.IO monitoring events from server to examiner dashboard. Show external browser events feeding the client monitoring hook. Label security controls: bcrypt password hashing, JWT, Helmet, CORS, rate limiting, input validation, and role-based access.

## Notes for production

- SQLite is ideal for local development and demonstrations; use PostgreSQL or another managed database for multi-user production deployment.
- Automatic score publication is enforced whenever the exam/results/student data is requested after closing. For precise background scheduling in production, add a server-side job queue or cron worker.
- Browser monitoring produces review evidence, not proof of misconduct. Examiners should apply human judgement before taking action.
