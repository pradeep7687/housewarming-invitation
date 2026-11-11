# Griha Pravesh invitation

A mobile-friendly invitation for Pradeep S K's housewarming on **July 7, 2027, at 9:00 AM IST**. Built with HTML, CSS, JavaScript and an original SVG illustration. No build step or dependencies.

## Host on GitHub Pages

1. Push this project to [pradeep7687/housewarming-invitation](https://github.com/pradeep7687/housewarming-invitation), including `.github/workflows/pages.yml`.
2. In **Settings → Pages → Build and deployment**, choose **GitHub Actions**.
3. Run **Actions → Deploy invitation to GitHub Pages → Run workflow**, or push to `main`.
4. Open [the invitation](https://pradeep7687.github.io/housewarming-invitation/) after a successful deployment. Enable **Enforce HTTPS** in Pages settings if it isn't already enforced.

The workflow publishes only the website files, not backend source or documentation. Relative asset paths work with GitHub project Pages URLs.

## Connect RSVP to Google Sheets

GitHub Pages is static hosting; it cannot save submissions on its own. Until an endpoint is configured, the form clearly offers WhatsApp instead and its submit button is disabled.

1. Create a private Google spreadsheet. Copy its ID from the URL between `/d/` and `/edit`.
2. Open **Extensions → Apps Script** from the sheet.
3. Replace the starter code with `google-apps-script/Code.gs`.
4. In Apps Script **Project Settings → Script properties**, add:
   - `SPREADSHEET_ID`: the spreadsheet ID.
   - `INVITATION_URL`: `https://pradeep7687.github.io/housewarming-invitation/`.
5. Run `setupRsvpSheet` once from the editor and authorize spreadsheet access. This creates a sheet named **RSVPs** with column headings.
6. Choose **Deploy → New deployment → Web app**. Set **Execute as: Me** and **Who has access: Anyone**. Deploy and authorize. Your Google account or organization's policy must allow public web apps.
7. Copy the deployed URL ending in `/exec`, not the editor-only `/dev` URL. Paste it into the `rsvpEndpoint` constant in `script.js` and push the update to GitHub.
8. Submit a test on the deployed site. The form navigates to Google's confirmation page only after the row is saved. Check the private **RSVPs** sheet for the submission. A return link takes guests back to the invitation.

The native form POST deliberately avoids `no-cors` fetches or fabricated success states. Browser or service failures remain visible; only the backend can confirm a saved response. The backend validates input and neutralizes spreadsheet formulas. No spreadsheet ID, credentials or secrets belong in frontend code. The web app URL is public by design.

If you change backend code, update the Apps Script deployment to a new version. Keep guest contact information private. Public forms can attract spam; the included honeypot is basic protection, not a substitute for monitoring submissions or adding stronger protection if needed. Google service quotas apply.

## Preview and customize

Open `index.html` directly in a browser. The countdown and contact links work without a server. Fonts and maps need an internet connection and have fallbacks.

- Event copy, host contact, date and structured metadata: `index.html`.
- Countdown target (explicit IST) and public RSVP endpoint: `script.js`. Keep the countdown date consistent with the displayed date and JSON-LD.
- Responsive design: `styles.css`.
- Original illustration: `home.svg`.
- Google Sheets backend: `google-apps-script/Code.gs`.

The map and directions intentionally point to **Mysore city**, because no street address was supplied. To use the exact home location, replace both map URLs and update the visible address, location note and event JSON-LD. The schedule shows the ceremony order without inventing ritual times. Guests selecting “Can't make it” can submit zero guests.

Before sharing, verify the mobile layout, Kannada copy, date, exact address, contact links, and a real deployed RSVP. Submission persistence requires completing the Google setup above. No gallery or analytics tracking is included.
