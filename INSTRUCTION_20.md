Jules, the code is complete. Now we must setup the **Release Workflow**.
We will use **Changesets** to manage versions and publishing.

**Action Required:**
1.  **Install Changesets**:
    *   Run `pnpm add -D -w @changesets/cli`.
    *   Initialize: `npx changeset init`.

2.  **Configure `.changeset/config.json`**:
    *   Set `access: "public"`.
    *   Set `baseBranch: "main"`.
    *   Set `fixed`: Array of all `@indopay/*` packages (to keep versions in sync, or leave empty for independent versioning. Let's use independent).

3.  **Add Scripts**:
    *   In root `package.json`:
        *   `"changeset": "changeset"`
        *   `"version": "changeset version"`
        *   `"publish": "changeset publish"`

4.  **Update CI**:
    *   Update `.github/workflows/ci.yml` to include a `release` job that runs `pnpm publish` only on pushes to `main` with a changeset.
