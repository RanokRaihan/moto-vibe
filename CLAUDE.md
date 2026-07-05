# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — type-check (`tsc -b`) then production build via Vite
- `npm run lint` — run ESLint over the whole project
- `npm run preview` — preview the production build

There is no test framework configured in this repo (no Jest/Vitest/etc.) — don't assume test commands exist.

## Architecture

This is a React 18 + TypeScript + Vite SPA (MotoVibe — a motorcycle store e-commerce frontend) talking to a separate backend API (see `bike-store-backend-v2.postman_collection.json` for the API contract; the backend repo has not been renamed). Path alias `@/*` maps to `src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`).

### Data layer: RTK Query over Redux Toolkit

- `src/redux/store.ts` — single store. Only the `auth` slice is persisted (via `redux-persist`, `localStorage`); everything else is RTK Query cache state.
- `src/redux/api/baseApi.ts` — the single `createApi` instance (`baseApi`) that all feature APIs inject endpoints into via `baseApi.injectEndpoints`. It wraps `fetchBaseQuery` with `baseQueryWithRefreshToken`, which on a 401 calls `auth/refresh-token`, dispatches `setUser` with the new access token, and retries the original request once; if refresh fails it dispatches `logout()`. Tag types (`products`, `adminOrders`, `users`) are declared here and used for cache invalidation.
- Feature APIs live under `src/redux/features/<domain>/*.api.ts` (e.g. `product/product.api.ts`, `order/order.api.ts`, `admin/*.api.ts`, `user/user.api.ts`, `auth/authApi.ts`). Each just calls `baseApi.injectEndpoints` and exports the generated hooks — follow this pattern for new endpoints rather than creating new `createApi` instances.
- `src/redux/features/auth/authSlice.ts` holds `{ user, token }` and is the only plain slice; `setUser`/`logout` actions are dispatched both from login flows and from the base query's refresh logic.

### Auth & routing

- JWT is decoded client-side with `verifyToken` (`src/lib/utils.ts`, wraps `jwt-decode`) to read `user.role` — the token itself is the source of truth for role, not a separate profile fetch.
- `src/components/layout/ProtectedRoute.tsx` / `PublicRoute.tsx` gate routes based on `auth.token` + decoded role (`admin` | `customer`). `ProtectedRoute` takes an optional `role` prop; omitting it just requires "logged in", not a specific role.
- Routes are defined with `createBrowserRouter` in `src/routes/routes.tsx`, with admin sub-routes split out into `src/routes/admin.routes.tsx` and mounted under `/admin` behind `<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>`.
- `src/app/dashboard/` and `src/app/login/` are leftover/unused scaffold files not wired into the router — don't treat them as the real dashboard/login pages (those are `src/pages/admin/AdminDashboard.tsx` and `src/pages/public/Login.tsx`).

### UI layer

- Built on shadcn/ui (`components.json`: style "new-york", base color neutral, no RSC) — generated primitives live in `src/components/ui`; compose those rather than hand-rolling equivalents.
- Feature components are grouped by domain under `src/components/` (`admin/`, `checkout/`, `forms/`, `home/`, `order/`, `productDetails/`, `products/`, `tables/`, `skeletons/`, `layout/`).
- Forms use React Hook Form + Zod, with schemas in `src/schemas/*.validation.ts` and `@hookform/resolvers` wiring the two together.
- Toasts go through `sonner` (`<Toaster>` mounted once in `main.tsx` with richColors/top-right); prefer it over ad hoc alerts.

### Checkout / payments

Checkout integrates with SurjoPay: an order is created (`order.api.ts` → `orders/place-order`), the user is redirected to the payment provider, and `orders/verify-payment` (queried with `order_id` from the redirect URL query param) confirms payment status on return — see `src/pages/customer/order/VerifyPayment.tsx` and `Checkout.tsx`.
