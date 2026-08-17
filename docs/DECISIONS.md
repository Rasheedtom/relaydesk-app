# Design decisions

## No data-fetching library
The app intentionally keeps asynchronous behavior visible in a small service and hook layer. This keeps the repository self-contained and makes ownership of request state explicit.

## Reducer over many setters
Queue interactions touch related state. A reducer makes transitions reviewable and prevents a bulk action from drifting away from single-item behavior.

## Stable ids
Rows, selections, activities, and updates use durable ids. Filters and sorts are projections, not owners of identity.
