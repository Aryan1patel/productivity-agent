# Executive Productivity Agent

A productivity dashboard for **Arjun Malhotra (VP Sales)** that tracks commitments, deadlines, and ownership across meetings, emails, calendars, and voice notes for the week of September 21-25, 2026.

## 🎯 Overview

This application processes multiple data sources and applies **"latest truth wins"** logic to provide executives with a clear view of:

- ✅ **Active commitments** — who promised what to whom
- ⏰ **Current deadlines** — reflecting the most recent updates
- 🚨 **Risk indicators** — overdue, slipped, or unowned items
- 📊 **Completion status** — confirmed deliverables

### Key Features

- **Intelligent ownership tracking** — Flags items without clear ownership
- **Deadline slippage detection** — Monitors how many times deadlines change
- **Calendar integration** — Cross-references commitments with scheduled events
- **Complete audit trail** — Transparent timeline of all status changes

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

### Run Tests

```bash
npm test
```

## 📊 Views

### 1. Daily Briefing 📅

- **Day selector** — Switch between Monday through Friday
- **Calendar view** — Daily schedule with all events
- **Commitments list** — Items due on the selected day
- **Risk alerts** — Highlights items needing attention

### 2. Weekly Status Board 📊

- **Overview grid** — All tracked items for the week
- **Status indicators** — Visual pills showing current state
- **Priority sorting** — At-risk items appear first
- **Slippage tracking** — Badges show deadline changes
- **Quick navigation** — Click items to view details

### 3. Alerts & Timeline ⚠️

- **Risk panel** — Categorized alerts (overdue, unowned, slippage, tight deadlines)
- **Timeline view** — Chronological history of each commitment
- **Source attribution** — Links events to original messages
- **Resolution tracking** — Shows how current status was determined

## 🧪 Test Coverage

The application includes comprehensive test coverage validating:

- Commitment extraction from multiple sources
- Latest truth resolution logic
- Deadline slippage tracking
- Ownership verification
- Calendar cross-referencing

Run tests with: `npm test`

Expected: 9/9 tests passing

## 🏗️ Technical Stack

- **Next.js 16** — React framework with App Router
- **TypeScript** — Type-safe development
- **Tailwind CSS** — Utility-first styling
- **Jest** — Testing framework

## 📁 Project Structure

```
productivity-agent/
├── app/                  # Next.js pages
├── components/           # React components
├── lib/                  # Core logic and tests
│   ├── processor.ts      # Main processing engine
│   └── __tests__/        # Test suite
├── data/                 # Static data fixture
├── types/                # TypeScript definitions
└── package.json          # Dependencies
```

## 🎯 Key Capabilities

### Data Processing

- Extracts commitments from meeting transcripts
- Parses email threads for status updates
- Integrates voice note transcripts
- Cross-references calendar events

### Resolution Logic

- Applies chronological ordering
- Identifies latest status for each item
- Detects deadline changes
- Tracks ownership assignment
- Flags unresolved items

### User Interface

- Responsive design
- Interactive navigation
- Real-time filtering
- Status visualization
- Detailed audit trails

## 🔍 Example Use Cases

**Scenario 1: Deadline Tracking**
- Initial commitment: "Will send by Tuesday"
- Update via email: "Pushed to Wednesday"
- System shows: Current deadline Wednesday, slippage count: 1

**Scenario 2: Ownership Clarity**
- Meeting discussion: "Someone needs to handle this"
- No assignment made
- System shows: Status "Unowned", flagged for attention

**Scenario 3: Status Confirmation**
- Commitment made in meeting
- Delivery confirmed via email
- Calendar entry exists for review meeting
- System shows: Status "Done", calendar-backed

## 📝 Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Environment

No environment variables required. All data is included in the repository.

## 📄 License

MIT

---

Built for managing executive commitments and tracking accountability across communication channels.
