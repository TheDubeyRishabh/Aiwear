/**
 * POST /api/tryon
 *
 * Calls the Virtual Try-On Diffusion (VTON-D) API by Texel.Moda via RapidAPI.
 * Docs: https://huggingface.co/spaces/texelmoda/virtual-try-on-diffusion-vton-d/blob/main/docs/API.md
 *
 * Endpoint used:
 *   POST https://try-on-diffusion.p.rapidapi.com/try-on-file
 *   - clothing_image  — garment photo (file upload)
 *   - avatar_image    — person photo  (file upload)
 *   - (optional) avatar_sex, clothing_prompt, avatar_prompt, background_prompt, seed
 *
 * Response: raw JPEG image bytes (Content-Type: image/jpeg)
 */

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import fetch from "node-fetch";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ─── Multer: save uploads to /uploads dir ──────────── */
const uploadsDir = path.resolve("uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 12 * 1024 * 1024 }, // 12 MB max (API limit)
});

/* ─── Delete temp file silently ─────────────────────── */
const safeUnlink = (p) => {
  if (!p) return;
  try { fs.unlinkSync(p); } catch { /* ignore */ }
};

/* ──────────────────────────────────────────────────────
   ROUTE  POST /api/tryon
   Body (multipart/form-data):
     person            — user/avatar photo       (required)
     cloth             — garment/clothing photo  (required)
     avatar_sex        — "male" | "female"        (optional)
     clothing_prompt   — text prompt for garment  (optional)
     avatar_prompt     — text prompt for avatar   (optional)
     background_prompt — text prompt for bg       (optional)
     seed              — integer, -1 = random     (optional)
────────────────────────────────────────────────────── */
router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "person", maxCount: 1 },
    { name: "cloth",  maxCount: 1 },
  ]),
  async (req, res) => {
    const personFile = req.files?.person?.[0];
    const clothFile  = req.files?.cloth?.[0];

    try {
      /* 1 ── Validate ──────────────────────────────── */
      if (!personFile || !clothFile) {
        return res.status(400).json({
          success: false,
          error: "Both 'person' and 'cloth' images are required.",
        });
      }

      if (!process.env.RAPIDAPI_KEY) {
        return res.status(500).json({
          success: false,
          error: "RAPIDAPI_KEY is not configured on the server.",
        });
      }

      /* 2 ── Build multipart form for VTON-D API ───── */
      const form = new FormData();

      // avatar_image = person photo
      form.append("avatar_image", fs.createReadStream(personFile.path), {
        filename:    personFile.originalname || "avatar.jpg",
        contentType: personFile.mimetype     || "image/jpeg",
      });

      // clothing_image = garment photo
      form.append("clothing_image", fs.createReadStream(clothFile.path), {
        filename:    clothFile.originalname || "clothing.jpg",
        contentType: clothFile.mimetype     || "image/jpeg",
      });

      // Optional extra parameters
      if (req.body.avatar_sex)          form.append("avatar_sex",          req.body.avatar_sex);
      if (req.body.clothing_prompt)     form.append("clothing_prompt",     req.body.clothing_prompt);
      if (req.body.avatar_prompt)       form.append("avatar_prompt",       req.body.avatar_prompt);
      if (req.body.background_prompt)   form.append("background_prompt",   req.body.background_prompt);
      if (req.body.seed !== undefined)  form.append("seed",                String(req.body.seed));

      console.log("\n🤖 VTON-D API → POST /try-on-file");

      /* 3 ── Call the VTON-D RapidAPI ─────────────── */
      const apiRes = await fetch(
        "https://try-on-diffusion.p.rapidapi.com/try-on-file",
        {
          method:  "POST",
          headers: {
            "x-rapidapi-host": "try-on-diffusion.p.rapidapi.com",
            "x-rapidapi-key":  process.env.RAPIDAPI_KEY,
            ...form.getHeaders(),
          },
          body: form,
        }
      );

      /* 4 ── Handle non-200 responses ─────────────── */
      if (!apiRes.ok) {
        const contentType = apiRes.headers.get("content-type") || "";
        let errDetail = `HTTP ${apiRes.status}`;

        if (contentType.includes("application/json")) {
          const errJson = await apiRes.json().catch(() => null);
          errDetail = errJson?.detail || JSON.stringify(errJson) || errDetail;
        } else {
          const errText = await apiRes.text().catch(() => "");
          if (errText) errDetail += ` — ${errText.slice(0, 200)}`;
        }

        console.error("VTON-D API error:", errDetail);

        if (apiRes.status === 403) {
          return res.status(500).json({ success: false, error: "Invalid RapidAPI key. Check RAPIDAPI_KEY in your .env." });
        }
        if (apiRes.status === 429) {
          return res.status(429).json({ success: false, error: "Rate limit reached. Wait a moment and try again, or upgrade your RapidAPI plan." });
        }
        if (apiRes.status === 400) {
          return res.status(400).json({ success: false, error: `Bad request: ${errDetail}` });
        }

        return res.status(500).json({ success: false, error: `VTON-D API error: ${errDetail}` });
      }

      /* 5 ── API returns raw JPEG → encode to base64 data URL */
      const arrayBuffer = await apiRes.arrayBuffer();
      const base64      = Buffer.from(arrayBuffer).toString("base64");
      const mime        = apiRes.headers.get("content-type") || "image/jpeg";
      const dataUrl     = `data:${mime};base64,${base64}`;
      const seedUsed    = apiRes.headers.get("x-seed") || null;

      console.log(`✅ VTON-D complete — seed used: ${seedUsed}`);

      return res.json({ success: true, image: dataUrl, seed: seedUsed });

    } catch (err) {
      console.error("TRYON ERROR:", err?.message || err);
      let msg = err?.message || "AI Try-On failed";
      if (msg.includes("ETIMEDOUT") || msg.includes("timeout")) {
        msg = "Request timed out. Please retry.";
      }
      return res.status(500).json({ success: false, error: msg });

    } finally {
      safeUnlink(personFile?.path);
      safeUnlink(clothFile?.path);
    }
  }
);

export default router;
