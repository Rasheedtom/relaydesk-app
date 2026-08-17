# Architecture

RelayDesk separates domain operations from React components. `src/domain` owns filtering, sorting, formatting, and reducer transitions. `src/services` simulates asynchronous persistence. Hooks coordinate browser and service lifecycles. Components render the queue and dispatch explicit domain actions.

The top-level reducer owns canonical work items, filters, selection, the active item, and transient notices. Search results are remote-style identifiers layered over locally derived filters. Selection uses stable work-item ids so visibility changes do not rewrite user intent.
