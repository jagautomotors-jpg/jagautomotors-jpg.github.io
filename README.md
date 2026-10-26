# Jag Auto Motors — website

A simple, fast used-car website with inventory filters (make, model, year, price, kilometres, body type) and a detail view for each vehicle. It is plain HTML, CSS and JavaScript, so it runs free on **GitHub Pages** with no build tools.

## Files

| File | What it is |
|---|---|
| `index.html` | The page itself |
| `styles.css` | Colours, fonts and layout |
| `app.js` | Filters and listings (no need to edit) |
| `inventory.js` | **Your dealer details and cars — edit this one** |
| `images/` | Put your car photos here |
| `logo/` | Your logo files (see below) |

## Put it online with GitHub Pages

1. Sign in at github.com and click **New repository**. Name it e.g. `jag-auto-motors`, set it to **Public**, and create it.
2. Click **Add file → Upload files**, drag in every file and the `images` folder from this zip, then click **Commit changes**.
3. Go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, branch **main**, folder **/(root)**, and click **Save**.
4. After a minute or two your site is live at `https://YOUR-USERNAME.github.io/jag-auto-motors/`.

To use your own domain (e.g. jagautomotors.ca), enter it under **Settings → Pages → Custom domain** and follow GitHub's DNS instructions for your domain registrar.

## Adding and updating cars

Open `inventory.js` on GitHub, click the pencil icon, edit, and **Commit changes**. The site updates in about a minute.

- **Add a car:** copy one `{ ... },` block and change the values. Every car needs a unique `stock` number.
- **Mark a car sold:** change `status: "available"` to `status: "sold"` (it disappears from the site).
- **Sale pending:** `status: "pending"` shows a "Sale pending" tag.
- **Photos:** upload pictures into `images/`, then list them, e.g. `photos: ["images/j1042-front.jpg", "images/j1042-interior.jpg"]`. The first photo is the main one. Landscape photos (4:3 or 16:10) look best.
- When your real cars are in, set `window.SAMPLE_INVENTORY = false;` to hide the "Sample listings" note.

## Before you launch

- Fill in `window.DEALER` at the top of `inventory.js`: check your phone, email, address, hours and VSA dealer number.
- BC dealer advertising rules expect the listed price to include all dealer fees (taxes can be extra), so enter prices that way.
- Review the two short promises (Trade-ins, Financing) in `index.html` and change any that don't fit your business.

## Logo files (`logo/` folder)

- **jag-auto-logo-…png** files are your original logo design. Its white lettering only shows on dark backgrounds, so use it on black.
- **shiny** versions have the metallic gold look, for the website, social media and screens.
- **flat** versions are solid gold, for printing, sign shops and embroidery.
- **black** and **white** versions are one colour, for decals, stamps and paperwork.
- `.svg` files can be scaled to any size without losing quality; give these to a sign shop or printer.
- `.png` files are ready to upload as a Facebook or Instagram profile picture.
