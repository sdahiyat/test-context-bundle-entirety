# API Contract Documentation

## Overview

All API routes live under `/api/` and follow a consistent request/response contract.

- **Base URL**: `/api/` (no version prefix; future versioning via `/api/v2/`)
- **Authentication**: Supabase JWT stored in cookies (managed by `@supabase/ssr`). Protected routes read the session from cookies automatically — no manual `Authorization` header required for browser clients.
- **Content-Type**: All request bodies and responses use `application/json`.

---

## Response Envelope

Every response (success or error) is wrapped in a consistent JSON envelope:

