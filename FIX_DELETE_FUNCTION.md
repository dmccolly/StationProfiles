# Fix Delete Function - Setup Guide

## Problem
The delete function (and likely add/edit functions) are not working because the Netlify function needs a GitHub token to make changes to your repository.

## Solution: Add GitHub Token to Netlify

### Step 1: Create a GitHub Personal Access Token

1. Go to GitHub Settings: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `StationProfiles Netlify`
4. Set expiration: Choose your preference (recommend: No expiration or 1 year)
5. Select these scopes:
   - ✅ **repo** (Full control of private repositories)
     - This includes: repo:status, repo_deployment, public_repo, repo:invite, security_events
6. Click **"Generate token"**
7. **IMPORTANT:** Copy the token immediately (you won't be able to see it again!)
   - It will look like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Add Token to Netlify

1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your **StationProfiles** site
3. Go to **Site settings** → **Environment variables**
4. Click **"Add a variable"** → **"Add a single variable"**
5. Enter:
   - **Key:** `GITHUB_TOKEN`
   - **Value:** Paste your GitHub token (the one starting with `ghp_`)
   - **Scopes:** Select "All scopes" or "Functions"
6. Click **"Create variable"**

### Step 3: Redeploy Your Site

After adding the environment variable, you need to trigger a new deployment:

**Option A: Trigger Deploy in Netlify**
1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Deploy site"**

**Option B: Push a Small Change**
1. Make any small change to your repository (even just a space in README)
2. Commit and push
3. Netlify will automatically redeploy

### Step 4: Test the Delete Function

1. Go to your admin panel: https://stationprofiles.netlify.app/admin/
2. Try to delete a test station
3. It should now work!

## Why This Is Needed

The Netlify function (`update-station.js`) uses the GitHub API to:
- ✅ Create new station files
- ✅ Update existing station files
- ✅ Delete station files
- ✅ Update the index.json file

Without the GITHUB_TOKEN, the function cannot authenticate with GitHub and make these changes.

## Security Note

- The token is stored securely in Netlify's environment variables
- It's never exposed in your code or to users
- Only your Netlify functions can access it
- You can revoke the token anytime from GitHub settings

## Troubleshooting

### If delete still doesn't work:

1. **Check the token is set correctly:**
   - Go to Netlify → Site settings → Environment variables
   - Verify `GITHUB_TOKEN` exists and has a value

2. **Check the token has correct permissions:**
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Find your token and verify it has **repo** scope

3. **Check Netlify function logs:**
   - Go to Netlify → Functions tab
   - Click on `update-station`
   - Check recent invocations for errors

4. **Verify the function is deployed:**
   - Go to Netlify → Functions tab
   - You should see `update-station` listed

### Common Errors:

**Error: "Bad credentials"**
- Solution: Token is invalid or expired. Generate a new one.

**Error: "Not Found"**
- Solution: Token doesn't have repo access. Check permissions.

**Error: "Resource not accessible by integration"**
- Solution: Token needs **repo** scope, not just **public_repo**.

## Alternative: Manual Management

If you prefer not to use the automated system, you can:
1. Download station JSON files manually
2. Edit them locally
3. Upload them back to GitHub
4. Update index.json manually

But the automated system is much more convenient once the token is set up!

## Next Steps

After setting up the token:
1. ✅ Delete function will work
2. ✅ Add station function will work
3. ✅ Edit station function will work
4. ✅ Index.json will auto-update

All changes will be committed directly to your GitHub repository!