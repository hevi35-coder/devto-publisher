# 📅 Weekly Content Automation Plan (MandaAct)

**Goal**: Establish a consistent "Productivity for Developers" brand presence on Dev.to by publishing high-quality, target-tailored content once a week.

## 1. Content Strategy: "Target-Tailored"
We will focus on the intersection of **Developer Life** and **Productivity Science**, positioning MandaAct as the solution.

### Target Audience
*   **Developers** experiencing burnout or "tutorial hell".
*   **Indie Hackers** juggling multiple projects.
*   **Junior Devs** trying to learn structured goal setting.

### Thematic Pillars (Rotation)
1.  **The Science of Planning**: Why 9x9 grids work better than linear lists.
2.  **Dev Lifestyle**: Managing side projects without quitting your day job.
3.  **Mental Models**: Applying engineering principles (recursion, decomposition) to life goals.
4.  **MandaAct Case Studies**: Real examples of usage.

---

## 2. Weekly Workflow (The Machine)

We will implement a **semi-automated** workflow initially to ensure quality, moving to **fully automated** as confidence grows.

### **Phase 1: "Assisted Autopilot" (Current)**
*   **Timeline**:
    *   **Monday (Agent)**:
        *   Select topic from `TOPIC_QUEUE.md`.
        *   Generate Draft (Markdown).
        *   Generate Cover Image (SD/DALL-E or layered text).
        *   **Action**: Create Pull Request (PR) to `main`.
    *   **Tuesday (User)**:
        *   Review PR.
        *   (Optional) Tweak content/images.
        *   **Action**: Merge PR.
    *   **Wednesday (Agent via GitHub Action)**:
        *   Trigger: On Push to `main` (filtered by folder).
        *   **Action**: Run `publish.js` (Upsert/Publish).
        *   **Action**: Run Browser Verification.

---

## 3. Implementation Steps

### Step 1: Content Queue (`TOPIC_QUEUE.md`)
Create a prioritized list of upcoming articles.
*   *Idea 1*: "Why 'To-Do' Lists Fail Developers (And What to Use Instead)"
*   *Idea 2*: "Decomposing Your Life: Applying 'Divide and Conquer' to Annual Goals"
*   *Idea 3*: "From `git commit` to `goal complete`: Tracking Life Progress"
*   *Idea 4*: "The 64-Action Rule: How Ohtani Shohei Designed His Career"

### Step 2: Content Generator Script (`generate_draft.js`)
*   **Input**: Topic Title + Tone (Professional/Witty).
*   **Output**: `drafts/YYYY-MM-DD-slug.md` with:
    *   Frontmatter (tags, series).
    *   Hook (Problem statement).
    *   Solution (MandaAct logic).
    *   Call to Action (App Store link).

### Step 3: GitHub Action Workflow (`.github/workflows/auto-publish.yml`)
*   **Trigger**: Push to `drafts/**` on `main`.
*   **Job**:
    1.  Checkout code.
    2.  Install dependencies (`npm ci`).
    3.  Run `node publish.js` (configured for idempotency).

---

## 4. Next Actions
1.  **Approve**: Validated this Weekly Plan?
2.  **Setup**: Create `TOPIC_QUEUE.md`.
3.  **Build**: Create the GitHub Action for auto-publishing on merge.
