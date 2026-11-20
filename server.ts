import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import {
  SCHOLARSHIPS,
  distinctRegionsCount,
  distinctFieldsCount,
  formatIsoDate,
  toDirectoryEntries,
  matchScholarships,
  searchScholarships,
  type StudentProfile,
} from './src/scholarships.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

function createGeminiClient(): GoogleGenAI | null {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getProfileRelatedQueries(profile: StudentProfile): string[] {
  const suggestions = new Set<string>();
  const state = (profile.state || '').toLowerCase();
  if (!state || state.includes('karnataka')) {
    suggestions.add('Karnataka SSP Post-Matric');
    if (profile.category === 'OBC' || profile.category === 'EWS') suggestions.add('Vidyasiri OBC');
    if (profile.category === 'SC' || profile.category === 'ST') suggestions.add('SWD Prize Money');
    if (profile.category === 'Minority') suggestions.add('DOM Minority');
    suggestions.add('CM Raitha Vidya Nidhi');
  }
  if (profile.field === 'Engineering & Technology') {
    suggestions.add('AICTE Pragati');
    suggestions.add('FFE Engineering');
  } else if (profile.field === 'Science') {
    suggestions.add('DST INSPIRE SHE');
    suggestions.add('Sir C.V. Raman');
  }
  if (profile.gender === 'Female') {
    suggestions.add('Azim Premji Women');
  }
  suggestions.add('Pre-Stopped Schemes');
  suggestions.add('Asia Fellowships');
  return Array.from(suggestions).slice(0, 6);
}

async function startServer(): Promise<void> {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Verified directory endpoint (Live to Apply + Pre-Stopped Karnataka / India / Asia)
  app.get('/api/scholarships', (_req, res) => {
    const now = new Date();
    const items = toDirectoryEntries(SCHOLARSHIPS, now);
    const liveCount = items.filter(i => i.status === 'live').length;
    const preStoppedCount = items.filter(i => i.status === 'pre_stopped').length;

    res.json({
      serverDate: formatIsoDate(now),
      total: SCHOLARSHIPS.length,
      liveCount,
      preStoppedCount,
      regionsCount: distinctRegionsCount(SCHOLARSHIPS),
      fieldsCount: distinctFieldsCount(SCHOLARSHIPS),
      items,
      relatedQueries: [
        'Karnataka SSP Post-Matric',
        'Vidyasiri OBC',
        'CM Raitha Vidya Nidhi',
        'AICTE Pragati Engineering',
        'FFE Bengaluru',
        'Asia (SINGA / GKS)',
        'Pre-Stopped Schemes',
      ],
    });
  });

  // Student profile matcher endpoint
  app.post('/api/scholarships/match', (req, res) => {
    const body = req.body as Partial<StudentProfile> | undefined;
    if (!body || !body.applyingFor || !body.citizenship || !body.field || !body.destination) {
      res.status(400).json({
        error: 'Incomplete student profile. Provide citizenship, applyingFor, field, and destination.',
      });
      return;
    }

    const profile: StudentProfile = {
      name: typeof body.name === 'string' ? body.name.trim() : '',
      age: typeof body.age === 'number' ? body.age : null,
      citizenship: String(body.citizenship),
      state: typeof body.state === 'string' && body.state.trim() ? body.state.trim() : 'Karnataka',
      currentLevel: String(body.currentLevel || ''),
      field: String(body.field),
      percent: typeof body.percent === 'number' && !Number.isNaN(body.percent) ? body.percent : null,
      incomeRange: String(body.incomeRange || 'Prefer not to say'),
      category: String(body.category || 'Prefer not to say'),
      gender: String(body.gender || 'Prefer not to say'),
      disability: String(body.disability || 'No'),
      destination: String(body.destination),
      applyingFor: String(body.applyingFor),
    };

    const now = new Date();
    const matches = matchScholarships(profile, SCHOLARSHIPS, now);
    const liveCount = matches.filter(m => m.status === 'live').length;
    const preStoppedCount = matches.filter(m => m.status === 'pre_stopped').length;

    res.json({
      serverDate: formatIsoDate(now),
      profile,
      matches,
      liveCount,
      preStoppedCount,
      totalMatched: matches.length,
      relatedQueries: getProfileRelatedQueries(profile),
    });
  });

  // Search + Related Search endpoint
  app.post('/api/scholarships/search', (req, res) => {
    const body = req.body as { query?: string; profile?: StudentProfile | null } | undefined;
    const query = typeof body?.query === 'string' ? body.query : '';
    const now = new Date();
    const basePool = body?.profile
      ? matchScholarships(body.profile, SCHOLARSHIPS, now)
      : toDirectoryEntries(SCHOLARSHIPS, now);

    const searchRes = searchScholarships(basePool, query);
    res.json({
      serverDate: formatIsoDate(now),
      ...searchRes,
    });
  });

  // Live Google-Search-grounded scholarship lookup via Gemini API (Server-side only)
  app.post('/api/scholarships/live-web', async (req, res) => {
    const ai = createGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'Live web search requires GEMINI_API_KEY configured in the server environment.',
      });
      return;
    }

    const body = req.body as { query?: string; profile?: Partial<StudentProfile> } | undefined;
    const userQuery = typeof body?.query === 'string' ? body.query.trim() : '';
    const p = body?.profile || {};
    const state = (p.state || 'Karnataka').trim();
    const level = p.applyingFor || 'Undergraduate';
    const field = p.field || 'Any';
    const category = p.category && p.category !== 'Prefer not to say' ? p.category : '';

    const todayStr = formatIsoDate(new Date());
    const prompt = [
      `Today's date is ${todayStr}.`,
      `Search for official, authentic scholarships currently LIVE to apply (and note any major pre-stopped/recently closed schemes with exact deadlines and next cycle dates) for a student in ${state}, India.`,
      `Student details: Level = ${level}, Field = ${field}${category ? `, Category = ${category}` : ''}${userQuery ? `, Search keyword = "${userQuery}"` : ''}.`,
      `Focus primarily on Karnataka State Government portals (SSP Karnataka, BCWD Vidyasiri, DOM, SWD, DCE), All-India official portals (NSP, AICTE, INSPIRE, FFE, Sitaram Jindal), and optionally 1-2 major Asia schemes if relevant.`,
      `Do NOT invent fake reviews, ratings, or unofficial blog links. List each scheme with its status (Live or Pre-Stopped/Closed), exact official deadline date, eligibility summary, and official portal name.`,
    ].join(' ');

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const seenUris = new Set<string>();
      const sources: Array<{ title: string; uri: string }> = [];
      for (const ch of chunks) {
        const w = ch?.web;
        if (w && typeof w.uri === 'string' && /^https?:\/\//i.test(w.uri) && !seenUris.has(w.uri)) {
          seenUris.add(w.uri);
          sources.push({
            title: typeof w.title === 'string' && w.title.trim() ? w.title.trim() : w.uri,
            uri: w.uri,
          });
        }
      }

      res.json({
        checkedAt: todayStr,
        summaryText: response.text || '',
        sources,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upstream Gemini search request failed.';
      res.status(502).json({
        error: message,
      });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SZ server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start SZ server:', err);
  process.exit(1);
});
