## Goal

Have **Factory Droid** work in *any* folder/workspace by routing model calls to a **single always-on local proxy**: CLIProxyAPI on `http://localhost:8317`.

This makes the “workspace” irrelevant for connectivity: the proxy runs once on your machine and Droid points at it globally.

---

## What’s installed where (your Mac)

### Factory Droid

- **Binary**: `~/.local/bin/droid`
- **Global settings**: `~/.factory/settings.json`
- **Custom model definitions** (your “Bring-your-own-endpoint” entries): `~/.factory/config.json`
- **Per-workspace chat/session logs**: `~/.factory/sessions/<encoded-workspace-path>/...`
  - This is why it can *feel* like “different installs per workspace”, but it’s the same Droid with separate session folders.

### CLIProxyAPI

- **Repo + binary**: `~/projects/CLIProxyAPI/`
  - The server binary is already built: `~/projects/CLIProxyAPI/cli-proxy-api`
- **Default server port** (from your `~/projects/CLIProxyAPI/config.yaml`): `8317`
- **Auth directory** (where CLIProxyAPI stores OAuth creds): `~/.cli-proxy-api/`

---

## The two things that must be true for Droid to “just work”

### 1) CLIProxyAPI must be running (localhost)

CLIProxyAPI only works for clients (Droid, Amp, etc.) when the server is actually running.

From `~/projects/CLIProxyAPI/`:

```bash
./cli-proxy-api -config ./config.yaml
```

That should keep running and listen on port `8317` (unless you change config).

### 2) Droid’s model name must exist in CLIProxyAPI’s model registry

CLIProxyAPI routes requests by looking up the model ID in its registry. If Droid requests a model ID that doesn’t exist, you’ll see errors like:

- `unknown provider for model ...`

In your setup, Droid was requesting:

- `claude-opus-4-5-20250101` (not a registered ID)

CLIProxyAPI’s registered Claude 4.5 Opus ID is:

- `claude-opus-4-5-20251101`

So the fix is: **change the custom model entry in `~/.factory/config.json` (and the selected model in `~/.factory/settings.json`) to use a registered model ID**.

---

## Credentials: CLIProxyAPI needs its own login

Even if Factory is logged into Claude, **CLIProxyAPI still needs its own provider credentials**.

If you want to use **Claude via OAuth** through CLIProxyAPI, run:

```bash
cd ~/projects/CLIProxyAPI
./cli-proxy-api -claude-login -config ./config.yaml
```

Then start the server again:

```bash
./cli-proxy-api -config ./config.yaml
```

CLIProxyAPI stores those creds under `~/.cli-proxy-api/` by default (matching your config).

---

## Quick verification checklist

- CLIProxyAPI server is running and listening on `8317`.
- Droid’s selected model in `~/.factory/settings.json` matches a registered CLIProxyAPI model ID.
- CLIProxyAPI has credentials (e.g. you ran `-claude-login`) so it can actually serve that model.



