#!/usr/bin/env node
/**
 * One-off import of coach profiles from "S7 Coaches.xlsx" (Sheet1) into Sanity.
 *
 *   Dry run (default):  node --env-file=.env scripts/import-coaches.mjs
 *   Write to Sanity:    node --env-file=.env scripts/import-coaches.mjs --commit
 *
 * Needs SANITY_API_TOKEN with Editor (write) rights.
 *
 * Photos are read from coaches-images-optimized/ (already resized/compressed).
 * A coach with a `photo` gets it uploaded and set as their profile photo,
 * replacing any existing one. Sanity dedupes assets by content hash, so
 * reruns reuse the same asset instead of uploading a copy.
 *
 * Rules:
 * - Existing coaches (matched by Sanity _id) get bio, certifications,
 *   specializations and achievements REPLACED by the sheet values.
 *   Blank cells in the sheet leave the existing field untouched.
 *   Name, slug, photo, experience, title and order are never changed.
 * - New coaches are created with title "Coach", no experience, no photo.
 *   Deterministic _id `trainer-<slug>` makes reruns safe (no duplicates).
 */
import { createReadStream, existsSync } from "node:fs";
import { createClient } from "@sanity/client";

const COMMIT = process.argv.includes("--commit");
const PHOTO_DIR = new URL("../coaches-images-optimized/", import.meta.url);

const PHYSIQUE = ["Physique Coaching", "Professional Bodybuilding", "Hypertrophy"];

/** @type {Array<{ name: string; id?: string; slug?: string; photo?: string; bio: string; certifications?: string[]; achievements?: string[]; specializations?: string[] }>} */
const COACHES = [
  {
    name: "Anjana",
    photo: "Anjana.jpg",
    slug: "anjana",
    certifications: ["REPS Level 4", "K11 Diploma in Personal Training", "NSQF Level 4 Certificate"],
    achievements: ["All India University Netball Player"],
    specializations: ["Strength Training", "Hypertrophy", "Fat Loss"],
    bio: "Anjana is a REPS Level 4 and K11 certified personal trainer and a former All India University netball player. She specialises in strength training, hypertrophy and fat loss, helping members build strength and reach their body goals.",
  },
  {
    name: "Nirosha",
    slug: "nirosha",
    certifications: ["Diploma in Personal Training (K11, NSQF Level 4, REPS)"],
    specializations: ["Powerlifting", "Weightlifting"],
    bio: "Nirosha holds a Diploma in Personal Training (K11, NSQF Level 4, REPS). She specialises in powerlifting and weightlifting, coaching members to lift with good technique and get stronger safely.",
  },
  {
    name: "Sumayya MN",
    photo: "Sumayya.jpg",
    id: "2fabd258-db46-4597-b793-349c148339d4",
    certifications: ["REPS India Certified Personal Trainer"],
    specializations: ["Weight Management", "Strength Training", "Senior Citizen Fitness"],
    bio: "Sumayya is a REPS India certified personal trainer. She specialises in weight management, strength training and senior citizen fitness, helping members of all ages train safely and stay active.",
  },
  {
    name: "Mehfil",
    photo: "Mehfil.jpg",
    id: "0a50ab95-32f8-4485-942b-3f63b96d9444",
    bio: "Mehfil is a coach at S7, helping members train with confidence and stay consistent on the way to their fitness goals.",
  },
  {
    name: "Abhijith Vp",
    photo: "Abhijith.jpg",
    id: "c0ebd219-98f3-4d9e-8810-b8bb4deb727f",
    certifications: ["K11 Certified Bodybuilding Specialist"],
    achievements: ["2x Mr. Malappuram (2018, 2020)", "Arm Wrestling Champion (2017, 2018, 2020)"],
    specializations: PHYSIQUE,
    bio: "Abhijith is a K11 certified bodybuilding specialist, a two-time Mr. Malappuram (2018 & 2020) and a multiple-time arm wrestling champion. He specialises in physique coaching, professional bodybuilding and hypertrophy.",
  },
  {
    name: "Jaseer",
    photo: "Jaseer.jpg",
    slug: "jaseer",
    specializations: PHYSIQUE,
    bio: "Jaseer specialises in physique coaching, professional bodybuilding and hypertrophy. He helps members build muscle and shape their physique with structured, focused training.",
  },
  {
    name: "Saifu",
    photo: "Saifu.jpg",
    slug: "saifu",
    certifications: ["Level 3 Personal Trainer", "Level 4 Fitness Trainer"],
    achievements: ["All India Inter-University Gold Medalist", "Reliance National Silver Medalist"],
    specializations: ["Run Coaching", "Plyometrics", "Functional Fitness"],
    bio: "Saifu is a Level 3 personal trainer and Level 4 fitness trainer, an All India Inter-University gold medalist and a Reliance National silver medalist. He specialises in run coaching, plyometrics and functional fitness.",
  },
  {
    name: "Zayd",
    photo: "Zayd.jpg",
    slug: "zayd",
    certifications: ["ACE Level 1 Certified Fitness Trainer", "ACE Level 3 Certified Fitness Trainer"],
    specializations: ["Calisthenics", "Strength Training", "Hypertrophy"],
    bio: "Zayd is an ACE Level 1 and Level 3 certified fitness trainer. He specialises in calisthenics, strength training and hypertrophy, helping members master bodyweight skills and build real strength.",
  },
  {
    name: "Kishore Vinu",
    photo: "Kishore.jpg",
    id: "a792b325-fe07-4039-b91b-f5fcf333901b",
    certifications: ["Diploma in Personal Training (DPT)"],
    specializations: PHYSIQUE,
    bio: "Kishore holds a Diploma in Personal Training (DPT). He specialises in physique coaching, professional bodybuilding and hypertrophy, helping members build muscle with goal-focused training.",
  },
  {
    name: "Athul Krishna PS",
    photo: "Athul.jpg",
    id: "34422655-fcf3-4ab2-bf4a-ef2e2c2852c4",
    certifications: ["B.Voc in Fitness Management and Personal Training"],
    achievements: ["Mr. Asia (2022)", "Mr. Kerala (2020)", "Mr. Ernakulam (2020)", "Mr. World Top 10"],
    specializations: PHYSIQUE,
    bio: "Athul holds a B.Voc degree in Fitness Management and Personal Training and is a Mr. Asia title holder. He specialises in physique coaching, professional bodybuilding and hypertrophy.",
  },
  {
    name: "Aswin",
    photo: "Aswin.jpg",
    slug: "aswin",
    specializations: ["Functional Fitness", "Weight Management", "Strength & Conditioning"],
    bio: "Aswin specialises in functional fitness, weight management and strength conditioning, helping members move better, get stronger and manage their weight.",
  },
  {
    name: "Akshay Dev",
    photo: "Akshay.jpg",
    id: "7cb92897-6304-412e-86a2-f88e4bee0817",
    certifications: ["Diploma in Personal Training (IBIS Fitness Academy)"],
    specializations: ["Strength & Conditioning", "Body Transformation"],
    bio: "Akshay holds a Diploma in Personal Training from IBIS Fitness Academy. He specialises in strength and conditioning and body transformation, guiding members through results-driven programmes.",
  },
  {
    name: "Eldho Jacob",
    photo: "Eldho.jpg",
    id: "e642498f-f49b-4e26-8adf-0d7f841adbcc",
    certifications: ["Diploma in Personal Training (DPT) & Hypertrophy"],
    achievements: ["ICN National Medalist", "WNBF National Medalist"],
    specializations: ["Calisthenics", "Physique Coaching", "Professional Bodybuilding"],
    bio: "Eldho holds a Diploma in Personal Training (DPT) with a focus on hypertrophy and is an ICN and WNBF national medalist. He specialises in calisthenics, physique coaching and professional bodybuilding.",
  },
  {
    name: "Suryaprakash",
    photo: "Surya.jpg",
    id: "ee93294a-38b9-40af-b228-3cf21261a078",
    certifications: ["PG Diploma in Advanced Personal Training & Sports Nutrition"],
    specializations: ["Strength Training", "Landmine Movements"],
    bio: "Surya holds a PG Diploma in Advanced Personal Training & Sports Nutrition. He specialises in strength training and landmine movements, combining smart training with sound nutrition guidance.",
  },
  {
    name: "Vishnu",
    photo: "Vishnu.jpg",
    slug: "vishnu",
    specializations: ["Powerlifting", "Body Recomposition", "Fat Loss", "Strength & Conditioning"],
    bio: "Vishnu specialises in powerlifting, body recomposition, fat loss and strength and conditioning, helping members get stronger while improving their body composition.",
  },
];

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "iq5i6f54";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

if (COMMIT && !token) {
  console.error("SANITY_API_TOKEN is not set — needed for --commit.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2025-01-01", useCdn: false, token });

for (const c of COACHES) {
  if (c.photo && !existsSync(new URL(c.photo, PHOTO_DIR))) {
    throw new Error(`${c.name}: photo not found: coaches-images-optimized/${c.photo}`);
  }
  if (c.bio.length > 400) throw new Error(`${c.name}: bio is ${c.bio.length} chars (max 400)`);
}

const existingIds = COACHES.filter((c) => c.id).map((c) => c.id);
const found = await client.fetch(`*[_id in $ids]._id`, { ids: existingIds });
const missing = existingIds.filter((id) => !found.includes(id));
if (missing.length) throw new Error(`Expected trainers not found in Sanity: ${missing.join(", ")}`);

/** Upload photos first (assets can't go in a transaction). */
const photoRefs = new Map();
if (COMMIT) {
  for (const c of COACHES.filter((x) => x.photo)) {
    const asset = await client.assets.upload("image", createReadStream(new URL(c.photo, PHOTO_DIR)), {
      filename: c.photo,
    });
    photoRefs.set(c.name, asset._id);
    console.log(`PHOTO   ${c.name.padEnd(18)} ${c.photo} → ${asset._id}`);
  }
  console.log("");
}

const tx = client.transaction();

for (const c of COACHES) {
  const fields = { bio: c.bio };
  for (const key of ["certifications", "achievements", "specializations"]) {
    if (c[key]?.length) fields[key] = c[key];
  }
  if (c.photo) {
    fields.photo = {
      _type: "image",
      asset: { _type: "reference", _ref: photoRefs.get(c.name) ?? "(uploaded on --commit)" },
      alt: `${c.name}, coach at SEC7OR Fitness`,
    };
  }

  if (c.id) {
    tx.patch(c.id, (p) => p.set(fields));
    console.log(`UPDATE  ${c.name.padEnd(18)} ${Object.keys(fields).join(", ")}`);
  } else {
    const _id = `trainer-${c.slug}`;
    tx.createIfNotExists({
      _id,
      _type: "trainer",
      name: c.name,
      slug: { _type: "slug", current: c.slug },
      title: "Coach",
      order: 99,
      isActive: true,
    });
    tx.patch(_id, (p) => p.set(fields));
    console.log(`CREATE  ${c.name.padEnd(18)} ${_id}${c.photo ? " + photo" : " (no photo)"}`);
  }
}

if (!COMMIT) {
  console.log("\nDry run — nothing written. Re-run with --commit to apply.");
  process.exit(0);
}

const res = await tx.commit();
console.log(`\nCommitted transaction ${res.transactionId} (${res.results.length} mutations).`);
