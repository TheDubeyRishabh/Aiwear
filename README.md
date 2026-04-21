# AI Wear — Virtual Try-On App

Full-stack AI fashion try-on app powered by **OOTDiffusion** (Hugging Face Space).

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite 7, TailwindCSS 4, Framer Motion |
| Backend | Node.js, Express 5, MongoDB (Mongoose) |
| AI | OOTDiffusion via HF Gradio REST API |
| Storage | Cloudinary (image hosting) |
| Auth | JWT + bcrypt + email verification |

---

## Setup

### 1. Clone / extract this project

```
aiwear/
  backend/
  frontend/
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in .env (see below)
npm run dev
```

**Required `.env` values:**

| Variable | Where to get it |
|----------|----------------|
| `MONGO_URI` | MongoDB Atlas → Connect → Drivers |
| `JWT_SECRET` | Any random string (e.g. `openssl rand -hex 32`) |
| `HF_TOKEN` | huggingface.co/settings/tokens → New token → **Read** role |
| `EMAIL_USER` | Your Gmail address |
| `EMAIL_PASS` | Gmail App Password (Google Account → Security → App Passwords) |

> No Cloudinary needed — images go directly to OOTDiffusion as Blobs.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## How the AI Try-On Works

Uses the **official `@gradio/client` SDK** (as documented on the Space API page):

```js
// Exactly what the backend does:
const client = await Client.connect("levihsu/OOTDiffusion", { hf_token });

const result = await client.predict("/process_hd", {
  vton_img:    personBlob,  // your photo as Blob
  garm_img:    clothBlob,   // garment image as Blob
  n_samples:   1,
  n_steps:     20,
  image_scale: 2,
  seed:        -1,
});
```

The result image is fetched, base64-encoded, and returned to the frontend.

**Two modes available** (send `mode` field in the request):
- `hd` (default) — `/process_hd` — VITON-HD, best for upper-body
- `dc` — `/process_dc` — Dress Code, supports `Upper-body` / `Lower-body` / `Dress`

---

## Pages

| Route | Description | Auth |
|-------|-------------|------|
| `/` | Landing page | Public |
| `/login` | Login / Sign Up | Public |
| `/shop` | Product catalog | ✅ Required |
| `/aitryon` | AI virtual try-on | ✅ Required |

---

## Notes

- OOTDiffusion on the free HF Spaces tier can take **30–90 seconds** per generation
- For faster results, upgrade to HF PRO or self-host the model
- The space URL is `https://levihsu-ootdiffusion.hf.space`
- Best person photos: full body, arms slightly away, neutral background
