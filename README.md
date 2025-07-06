# Knowledge Base Platform

A collaborative documentation platform inspired by Confluence, enabling teams to create, share, and manage documents securely.

🔗 **Live Demo:**  
[https://knowledge-base-platform-brown.vercel.app/](https://knowledge-base-platform-brown.vercel.app/)

---

## ✨ Features

✅ **User Authentication**
- Sign up with email/password or Google
- Login and JWT-based session handling
- Password reset via email

✅ **Document Management**
- Create, edit, and delete documents in a rich WYSIWYG editor
- Auto-save drafts
- List all accessible documents
- View documents in public or private mode

✅ **Search**
- Global search across document titles and content

✅ **Privacy Controls**
- Public documents accessible via link
- Private documents restricted to authorized users

---

## 🏗️ Tech Stack

- **Frontend:** Next.js 15, Tailwind CSS
- **Backend:** Supabase (Postgres, Auth, Storage)
- **Auth:** Supabase Auth (JWT)
- **Editor:** TipTap Rich Text Editor

---

## ⚙️ Local Development

### 1️⃣ Clone Repository

```bash
git clone https://github.com/RichaP23/knowledge-base-platform.git
cd knowledge-base-platform
## ⚙️ Local Development

### 2️⃣ Install Dependencies

```bash
npm install
## 3️⃣ Configure Environment Variables

Create a `.env.local` file in the project root:

NEXT_PUBLIC_SUPABASE_URL=<your Supabase project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your Supabase anon public key>

**Tip:** For production deployments, you can also set:


---

## 4️⃣ Start Dev Server

```bash
npm run dev

The app will be available at:
http://localhost:3000

## 🛠️ Database Setup

✅ **Profiles Table**

- Automatically created by Supabase Auth (`auth.users`).
- `handle_new_user` trigger inserts rows into `public.profiles` on new signups.

✅ **Row-Level Security**

- RLS policies must be enabled and configured for `documents` and `profiles`.

✅ **Function**

- `handle_new_user` ensures profiles are created whenever a user signs up.

---

## 🧪 Testing the App

### 1️⃣ Sign Up

- Register via email/password or sign in with Google.
- Confirm a row appears in `profiles` in your Supabase project.

### 2️⃣ Create Documents

- Use the editor to create and save documents.

### 3️⃣ Public Links

- Mark a document as public.
- Test the link in an incognito window.

---

## 📝 Project Structure

/src
/app
/auth (login/register)
/dashboard (authenticated dashboard)
/public (public document pages)
/components (shared UI components)
/lib (Supabase client, helpers)


---

## 🎨 UI

- Tailwind CSS for styling and responsive layouts.

---

## 🙋‍♂️ Demo Accounts

*(Optional: if you created demo accounts)*

- **Email:** `jeantomy6@gmail.com`  
- **Password:** `testing`

---

## 📦 Deployment

This app is deployed on **Vercel**:

- Deploys automatically on `main` branch pushes.
- Environment variables configured in Vercel project settings.

