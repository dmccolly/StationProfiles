# GitHub Token Setup for Admin Panel

## Problem
The admin panel's delete and edit functions require write access to the GitHub repository, but the current token only has read permissions.

## Solution
Update the GITHUB_TOKEN in Netlify with proper write permissions.

## Steps

### Option 1: Classic Personal Access Token (Recommended)

1. **Create the token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Name: "Netlify StationProfiles Admin"
   - Expiration: Choose your preference (90 days, 1 year, or no expiration)
   - Select scopes:
     - ✅ **repo** (Full control of private repositories)
   - Click "Generate token"
   - **IMPORTANT:** Copy the token immediately! You won't see it again.

2. **Update Netlify:**
   - Go to: https://app.netlify.com/sites/stationprofiles/configuration/env
   - Find `GITHUB_TOKEN` in the list
   - Click "Options" → "Edit"
   - Paste your new token
   - Click "Save"

3. **Redeploy:**
   - The site will automatically redeploy
   - Or manually trigger: Site configuration → Deploys → Trigger deploy → Deploy site

### Option 2: Fine-Grained Personal Access Token

1. **Create the token:**
   - Go to: https://github.com/settings/personal-access-tokens/new
   - Token name: "Netlify StationProfiles Admin"
   - Expiration: Choose your preference
   - Repository access: "Only select repositories"
     - Select: **StationProfiles**
   - Repository permissions:
     - **Contents**: Read and write ✅
   - Click "Generate token"
   - Copy the token

2. **Update Netlify:** (Same as Option 1, step 2)

3. **Redeploy:** (Same as Option 1, step 3)

## Verification

After updating the token and redeploying:

1. Go to: https://stationprofiles.netlify.app/admin/
2. Try to delete a station
3. It should work without errors!
4. Try to edit a station
5. It should save successfully!

## Troubleshooting

If you still see errors after updating:

1. **Check the token has the right permissions:**
   - Classic token: Must have `repo` scope
   - Fine-grained token: Must have `Contents: Read and write`

2. **Verify the token is set in Netlify:**
   - Go to: https://app.netlify.com/sites/stationprofiles/configuration/env
   - Confirm `GITHUB_TOKEN` exists and has a value

3. **Check function logs:**
   - Go to: https://app.netlify.com/sites/stationprofiles/functions/update-station
   - Look for any error messages

4. **Ensure the site redeployed:**
   - Go to: https://app.netlify.com/sites/stationprofiles/deploys
   - The latest deploy should be after you updated the token

## Security Notes

- Never commit the token to the repository
- Never share the token publicly
- The token is stored securely in Netlify's environment variables
- You can regenerate the token anytime if it's compromised
- Consider setting an expiration date for security

## What This Token Does

The token allows the Netlify function to:
- Create new station files
- Update existing station files
- Delete station files
- Update the index.json file

All operations are performed through the GitHub API on behalf of your account.