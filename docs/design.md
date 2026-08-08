# TODO Sessions App - Design

## Overview

A lightweight, offline-first web app for running focused TODO sessions.

Core interaction:

- Start a new session.
- Add TODO items as checklist entries.
- Check/uncheck items in a Google Docs-like editing experience.
- Reopen and review past sessions.

## Product Goals

1. Minimalistic interface with fast interaction.
2. Fully offline-capable after first load.
3. Persistent local data using IndexedDB (not localStorage).
4. Session history with date metadata.
5. Default session title of "Untitled" and editable title.

## Recommended Frontend Stack

- React + Vite + TypeScript
- Dexie (IndexedDB wrapper)
- Tiptap editor with TaskList / TaskItem extensions
- vite-plugin-pwa for service worker and offline caching

### Why this stack

1. Lighter and simpler than SSR-heavy frameworks for local-first usage.
2. Fast startup and low complexity for a small product.
3. Tiptap provides a polished Docs-like checkbox editing UX out of the box.

## Functional Requirements

1. Offline + IndexedDB

- All sessions and TODOs are stored in IndexedDB.
- App shell is cached via service worker so app can launch offline.

2. Session History

- User can view a list of past sessions.
- User can reopen any previous session for editing.

3. Session Defaults

- New session is created with:
  - title: "Untitled"
  - createdAt: current date/time
  - updatedAt: current date/time

4. Editor Behavior

- TODOs appear as checkboxes in a rich text editing area.
- Enter creates a new TODO line.
- Toggling checkbox updates completion state.
- Changes auto-save (debounced).

## Minimal Data Model

### Session

- id: string
- title: string (default "Untitled")
- createdAt: number (epoch ms)
- updatedAt: number (epoch ms)
- archived: boolean (optional)

### TodoItem

- id: string
- sessionId: string
- text: string
- checked: boolean
- order: number
- createdAt: number (epoch ms)
- updatedAt: number (epoch ms)

## UI Structure

### 1) Home

- Primary action: Start Session
- Secondary action: View History

### 2) Session Editor

- Header: editable session title + date
- Main area: checklist editor
- Auto-save indicator (optional)

### 3) History

- Sessions sorted by updatedAt (latest first)
- Show title, date, item count, last edited
- Actions: Open, Rename, Archive/Delete

## App Flows

### Start Session

1. User clicks Start Session.
2. App creates Session with default values.
3. App navigates to editor view.

### Edit Session

1. User types TODOs and toggles checkboxes.
2. App debounces writes and persists to IndexedDB.
3. updatedAt is refreshed on meaningful changes.

### Open History Session

1. User opens History.
2. User selects a prior session.
3. App loads session + associated TODOs into editor.

## Offline Strategy

1. Use `vite-plugin-pwa` with Workbox defaults for app shell assets.
2. Keep all business data local in IndexedDB.
3. No server dependency required for MVP.

## Implementation Plan (Phased)

### Phase 1: Foundation

1. Scaffold Vite React TypeScript app.
2. Add dependencies: Dexie, Tiptap, PWA plugin.
3. Set up routing (Home, Editor, History).

### Phase 2: Persistence

1. Define Dexie schema and indexes.
2. Implement session CRUD functions.
3. Implement TODO CRUD and ordering functions.

### Phase 3: Editor

1. Integrate Tiptap checklist extensions.
2. Map editor changes to TodoItem records.
3. Add keyboard-friendly checklist behavior.

### Phase 4: History

1. Build history listing page.
2. Add open/rename/archive actions.
3. Ensure stable sorting and metadata display.

### Phase 5: Offline + QA

1. Configure and verify service worker.
2. Validate offline launch and editing.
3. Test edge cases:

- Empty sessions
- Rapid edits
- Title default and rename behavior

## Non-Goals for MVP

1. Real-time collaboration.
2. Cloud sync / multi-device sync.
3. User accounts and authentication.

## Future Extensions

1. Session tags and filtering.
2. Export/import sessions (JSON/Markdown).
3. Optional cloud backup/sync.
4. Calendar-style session timeline.
