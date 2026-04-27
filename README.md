# TaskFlow 🚀

<div align="center">
  <p>A modern, high-performance Kanban board designed for seamless productivity and fluid user experience.</p>
  <strong><a href="https://taskflow-tau-nine.vercel.app/" target="_blank">View Live Demo</a></strong>
</div>

---

## 📖 Project Overview

TaskFlow is a Trello-like project management tool built for small-to-medium teams. It allows users to visually organize their tasks across customizable columns using intuitive drag-and-drop interactions. Rather than building a simple MVP, TaskFlow is engineered with a focus on **premium aesthetics**, **buttery smooth interactions**, and **highly optimized state management**.

## 💻 Tech Stack

- **Framework:** Next.js 14+ (App Router, Server Actions)
- **Database & Auth:** Supabase (PostgreSQL + RLS)
- **Drag-and-Drop:** `@hello-pangea/dnd`
- **Styling:** Tailwind CSS + custom glassmorphism & drop animations
- **Components:** Shadcn UI + Lucide Icons
- **Deployment:** Vercel

## ✨ Key Features

- **Fluid Drag-and-Drop:** A premium DnD experience featuring lifting physics, deep shadows, smooth rotation, and ghosting prevention.
- **Persistent Sorting:** State survives page refreshes and is synchronized directly with the database.
- **Secure Authentication:** Integrated Supabase Auth ensuring users can only manage and view their own personal boards and cards.
- **Responsive & Mobile Ready:** Drag-and-drop mechanics support long-press touch actuation, with dedicated grip indicators for mobile visibility.

## 🛠️ Technical Highlights

### Fractional Indexing
To solve the classic "Kanban Sorting Problem," TaskFlow utilizes a **Lexicographical Fractional Indexing** algorithm. When a card is dragged and dropped between existing cards, it computes a new alphanumeric position string (e.g., placing a card between `"a"` and `"c"` yields `"b"`). 
* **The Benefit:** This guarantees $O(1)$ database writes per drag operation. Instead of shifting the index of 100+ rows just to move one card, only the specific moved card's row is updated in Supabase.

### Optimistic UI
TaskFlow is designed to feel instantaneous. When a user drops a card into a new column, the React state is updated **optimistically** on the client side before the background `POST` request finishes.
* **The Benefit:** Zero perceived latency. If the database mutation fails for any reason, the UI rolls back to its original snapshot gracefully, notifying the user.

## 🤖 GenAI Workflow

TaskFlow was developed utilizing an advanced **AI pair-programming workflow**, leveraging AI agents integrated directly into the workspace. The development lifecycle relied heavily on contextual coding, iterative architectural planning, and active debugging loops orchestrated alongside **Claude 3 Opus** (and native IDE AI integrations like Cursor). 

This AI-driven approach significantly accelerated solving complex challenges like the nested scroll constraints of the DnD library and strict-mode portal rendering anomalies.

## ⚙️ Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/taskflow.git
   cd taskflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.
