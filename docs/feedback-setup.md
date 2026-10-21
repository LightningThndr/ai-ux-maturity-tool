# Collecting feedback in a Google Sheet

The final step of the assessment asks people how accurate their results were and
whether they have any comments. When they submit, the tool sends one row to a
Google Sheet that you own. It's free and doesn't need a server.

Each row contains:

| Column | What it holds |
|---|---|
| receivedAt | When the row was written (set by Google) |
| submittedAt | When the person pressed submit (from their browser) |
| version | Which version of the assessment they took |
| role | Role chosen on the start page, if any |
| strategy, process, literacy, outcomes, trust | Their 1–5 answer for each factor |
| notSure | Factors they marked "I'm not sure" |
| composite, level | Weighted score and maturity level |
| archetype, priorityGap | Their archetype and priority gap factor |
| accuracy | Their 1–5 accuracy rating |
| comments | Their suggestions or comments |

No names, emails, or other contact details are collected.

## One-time setup (about 10 minutes)

1. Create a new Google Sheet, for example "AI-UX Maturity feedback".
2. In the sheet, open **Extensions → Apps Script**.
3. Delete the starter code, paste in the script below, and click **Save**.
4. Click **Deploy → New deployment**. Choose the type **Web app**, then set:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Click **Deploy**, approve the permissions Google asks for, and copy the
   **Web app URL**. It ends in `/exec`.
6. Give that URL to the tool as `VITE_FEEDBACK_ENDPOINT`:
   - **Locally:** copy `.env.example` to `.env.local` and paste the URL after
     the `=`.
   - **On your host** (Vercel, Netlify, GitHub Actions, and so on): add an
     environment variable named `VITE_FEEDBACK_ENDPOINT` with the URL, then
     rebuild. Vite only reads it at build time.

If the URL isn't set, the feedback page still appears, but it tells people that
nothing was sent.

```js
const SHEET_NAME = 'Feedback';
const HEADERS = ['receivedAt', 'submittedAt', 'version', 'role',
  'strategy', 'process', 'literacy', 'outcomes', 'trust',
  'notSure', 'composite', 'level', 'archetype', 'priorityGap',
  'accuracy', 'comments'];

// Stop free text that starts with = + - @ from being run as a formula.
function safe(value) {
  const text = value == null ? '' : String(value).slice(0, 5000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

  const s = data.scores || {};
  sheet.appendRow([
    new Date(), safe(data.submittedAt), safe(data.version), safe(data.role),
    s.strategy, s.process, s.culture, s.outcomes, s.trust,
    safe((data.notSure || []).join(', ')),
    data.composite, data.level, safe(data.archetype), safe(data.priorityGap),
    data.accuracy, safe(data.comments)
  ]);
  return ContentService.createTextOutput('ok');
}
```

## Good to know

- **Updating the script:** if you edit it later, use **Deploy → Manage
  deployments → Edit → New version**. That keeps the same URL.
- **Open endpoint:** the URL accepts posts from anyone who finds it, so someone
  could send junk rows. For a feedback form that risk is usually acceptable. If
  it becomes a problem, add a shared token check or move to a form service with
  spam filtering.
- **Privacy:** the feedback page tells people exactly what is sent. If you add
  any field that could identify someone, update that notice too.
