# VocabBuilder

VocabBuilder is a vocabulary learning web application built with Next.js and TypeScript.

## Tech stack

- Next.js
- React
- TypeScript
- React Hook Form
- Yup
- Zustand
- TanStack Query
- TanStack Table
- Axios
- CSS Modules

## Project status

Base project setup and initial authentication layer are implemented.

At this stage, the project already includes:

- base folder architecture
- App Router routing
- global styles
- local fonts connected through `@font-face`
- shared providers
- public and private route structure
- basic pages for:
  - `/`
  - `/login`
  - `/register`
  - `/dictionary`
  - `/recommend`
  - `/training`

## Implemented auth base

The project already includes a basic authentication flow:

- public auth pages for:
  - `/login`
  - `/register`
- form validation with `react-hook-form` and `Yup`
- reusable form field with password visibility toggle
- auth requests handled through Next.js route handlers:
  - `/api/auth/register`
  - `/api/auth/login`
  - `/api/auth/logout`
  - `/api/auth/me`
- cookie-based token storage on the server
- Zustand auth store
- auth hydration after page reload
- redirects after successful login and registration
- basic logout flow
- client-side public/private route guards
- server-side route protection through middleware
- toast notifications for auth success and error states

## Design and technical task

- Figma design: VocabBuilder
- Backend API: vocab-builder-backend

## Notes

The project is currently in the base implementation stage.

Authentication pages and basic auth logic are already connected.
Main business features such as dictionary functionality, recommend flow, and training logic will be implemented in the next steps.
