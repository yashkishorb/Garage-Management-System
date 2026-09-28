# Garage System — Audit & Backend Requirements

Status of this document: written from the source code only. **No backend code,
API docs, Postman collection or `.env` were provided**, so the only endpoints
treated as real are the four the app already calls.

## 1. Endpoints that exist (already called by the app)

| Method | Path | Used by | Notes |
|---|---|---|---|
| POST | `/auth/request-otp` | LoginScreen | body `{ phoneNo }` → `{ success, message }` |
| POST | `/auth/resend-otp` | OtpScreen | body `{ phoneNo }` → `{ success, message }` |
| POST | `/auth/verify-otp` | OtpScreen | body `{ phoneNo, otp }` → `{ success, data: { accessToken, user, garage?, isProfileComplete } }` |
| POST | `/auth/update-garage-profile` | GarageDetails | body = garage fields (see GarageDetails payload) |

Everything else in the app is currently UI over local/hardcoded data.

## 2. Screens using hardcoded / local-only data (no API exists to wire them to)

| Screen | What is fake | Wired? |
|---|---|---|
| MyCustomersScreen | `MOCK_CUSTOMERS` | no |
| CustomerProfileScreen | static content | no |
| CustomerRepairOrderScreen | `// TODO: API search` | no |
| AddCustomerScreen | previously showed "saved" with nothing saved | **now calls `createCustomer()`; shows an honest error until the endpoint is configured** |
| AddGarageUserScreen | previously showed "User Created" with nothing saved | **same treatment via `createGarageUser()`** |
| GarageUsersScreen | `MOCK_USERS` | no |
| MyVendorsScreen | `MOCK_VENDORS`, add/edit only mutates local state | no |
| TagsManagementScreen | `MOCK_TAGS`, local-only CRUD | no |
| JobCardChecklistScreen | `MOCK_CHECKLISTS`, local-only CRUD | no |
| ServicePartsScreen | `MOCK_SERVICES`, `MOCK_PARTS`, local-only add; brand/model picker and CSV upload "coming soon" | no |
| GaragePackagesScreen | service/part/image pickers "coming soon" | no |
| AccountsScreen | `INCOME_DATA` and a hardcoded net summary (income "3,800.00") — **displays invented figures as real** | no |
| OrdersScreen | permanently empty list (`useState([])`) | no |
| ReportsScreen | every report tile is "Coming soon" | no |
| Insurance due / Service reminders / Service feedback | filter "coming soon", no data source | no |
| SettingsScreen | 7 options "Coming soon" (calendar, preferences, parts approval, booking portal, feedback, invoice PDF, payment gateway) | no |
| Parts / StockIn / PurchaseOrder / InventoryAlerts / CounterSale / Service home | no data source | no |

## 3. Backend endpoints still needed

Method/paths below are **not confirmed**. Please supply the real routes and
response shapes (or the backend repo / OpenAPI / Postman file); the frontend
constants are `null` in `src/utils/constants.js` until then.

- **Customers**: list (search, pagination), get, create (`{ fullName, phoneNo, emailId?, address?, role:"customer" }`), update, delete/deactivate, vehicles, history.
- **Garage users (staff)**: list, create (`{ firstName, lastName?, emailId?, phoneNo, role }`), update, deactivate.
- **Repair orders / services**: list with status filter + search, create, update, detail, status transitions, parts used, labour/costs, feedback.
- **Parts/inventory**: CRUD, stock quantity, low-stock, categories, brands, models, stock-in, purchase orders, CSV bulk import.
- **Vendors**: CRUD (+ transactions).
- **Accounts**: income, expense, payable, transactions, shared/group payments, totals for a date range (authoritative totals from server).
- **Reports**: revenue, expense, services, parts, customers, inventory, P&L.
- **Notifications**: list, mark read (and push token registration if push is wanted). The app has bell icons (e.g. Service home) but **no** notifications screen, fetching, push or socket code.
- **Settings**: profile update, password/security, preferences, booking portal, payment gateway, invoice format, calendar integration (needs external OAuth credentials).
- **Image upload**: multipart `file` → `{ url }` or `{ data: { url } }`; set the path in `UPLOAD_IMAGE_PATH`. Needed for the garage logo (`src/api/upload.js`).
- **Token refresh** (optional): the app has no refresh flow. On expiry / 401 it logs the user out.

## 4. What was changed

Auth / API foundation:
- `src/api/axios.js`: 401 (when a token was sent) now clears storage **and** logs the user out in Redux (previously storage was cleared but the app stayed "logged in"); expired JWTs are not sent; missing `API_BASE_URL` gives a clear error; timeout message; Zod-style `errors[].message` supported.
- `src/api/authEvents.js` (new): decouples Axios from the Redux store.
- `src/utils/storage.js`: access token moved to `expo-secure-store` (one-time migration from AsyncStorage); web falls back to AsyncStorage.
- `src/utils/token.js` (new): client-side JWT `exp` check (no signature verification).
- `src/store/slices/authSlice.js`: expired session discarded on startup; `profileComplete` state + `selectNeedsGarageSetup`.
- `src/navigation/AppNavigator.js`: first-time owners are routed to garage onboarding (previously `navigation.navigate("GarageDetails")` was called from a screen that had just been unmounted by the login state change, so onboarding was unreliable).
- `OtpScreen`: refuses to log in if the response has no token/user (previously could enter an "authenticated" state with `undefined` token).
- `GarageDetails`: onboarding completes via state; back on step 1 in onboarding offers logout instead of a dead end.
- `src/api/auth/index.js`: removed no-op try/catch wrappers; `uploadImage` was imported but **did not exist** — now `src/api/upload.js`, configured by `UPLOAD_IMAGE_PATH`.
- `src/hooks/useFetch.js`: an inline `fallback` caused an infinite refetch loop and masked the error; fixed.

Honest failure instead of fake success: AddCustomer, AddGarageUser (loading state, duplicate-submit guard, email validation).

Build health: `expo-image-picker` and `expo-blur` were SDK 55 packages in an SDK 54 app → realigned to SDK 54 versions (also gesture-handler, reanimated, svg, slider); added `react-native-worklets` (Reanimated 4 peer dep) and `expo-secure-store`; removed unused `expo-blur`; added ESLint (`npm run lint`).

Removed dead code: `AuthContext.js`, `mockData.js` and `CourseBadge.js` (leftovers from a course app, unused), `getImageFallback`, `console.log` calls.

## 5. Configuration

Copy `.env.example` → `.env`:

| Variable | Required | Purpose |
|---|---|---|
| `API_BASE_URL` | yes | backend base URL (no trailing slash; LAN IP or deployed URL on a physical device) |
| `UPLOAD_IMAGE_PATH` | no | image upload route for the garage logo |

`app.json` currently contains only `extra.eas.projectId` and the Android package; add `name`, `slug`, `version`, `icon`, `ios.bundleIdentifier` etc. before a store release. `eas.json` is unchanged.

## 6. Commands

```bash
npm ci
cp .env.example .env        # then set API_BASE_URL
npx expo start -c           # dev (clears Metro cache so .env is picked up)
npm run lint
npm run bundlecheck         # full Metro/Hermes production bundle for Android
```
