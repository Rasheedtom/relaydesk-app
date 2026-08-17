# RelayDesk

RelayDesk is a focused React work-queue application for teams that triage service requests. It models a realistic inbox: filtering, delayed search, multi-row selection, assignment, status transitions, notes, keyboard shortcuts, a detail drawer, and accessible live feedback.

## Requirements

- Node.js 20
- npm

## Local development

```bash
npm ci
npm run dev
```

## Verification

```bash
npm test
npm run lint
npm run check
npm run build
```

The app is self-contained. It uses an in-memory service layer and does not require credentials or network services at runtime.

## Product model

A work item represents a request entering an operations team. Agents can search and filter the queue, retain a working selection across views, inspect history, assign ownership, update status, and add internal notes. Delays in the service layer intentionally resemble real remote latency so interaction behavior can be exercised without a backend.
