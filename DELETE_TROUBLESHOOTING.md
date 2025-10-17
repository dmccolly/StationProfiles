# Delete Function Troubleshooting Guide

## Current Status

I've added detailed logging to help diagnose the issue. The error message "Missing required fields: action, stationId" suggests the Netlify function is being called but not receiving the data correctly.

## Immediate Steps to Fix

### Step 1: Set Up GitHub Token (REQUIRED)

The delete function **requires** a GitHub token to work. Without it, even if the request reaches the function, it cannot delete files from your repository.

**Quick Setup:**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: `StationProfiles Netlify`
4. Check: ✅ **repo** (full control)
5. Generate and copy the token
6. Go to Netlify: https://app.netlify.com
7. Open your StationProfiles site
8. Go to: Site settings → Environment variables
9. Add variable:
   - Key: `GITHUB_TOKEN`
   - Value: (paste your token)
10. Trigger a new deploy

### Step 2: Check Netlify Function Logs

After the next deployment, try to delete a station again, then:

1. Go to Netlify dashboard
2. Click on your StationProfiles site
3. Go to **Functions** tab
4. Click on `update-station`
5. Look at the recent invocations
6. Check the logs for these messages:
   - "GITHUB_TOKEN exists: true/false"
   - "Received event.body: ..."
   - "Parsed body: ..."
   - "Extracted values - action: delete, stationId: ..."

### Step 3: Verify Function Deployment

Make sure the Netlify function is deployed:

1. Go to Netlify → Functions tab
2. You should see `update-station` listed
3. If not, check the deploy logs for errors

## Common Issues and Solutions

### Issue 1: "Missing required fields: action, stationId"

**Possible Causes:**
- Function isn't receiving the request body
- CORS issue blocking the request
- Function not deployed with latest code

**Solutions:**
1. Check Netlify function logs (see Step 2 above)
2. Verify the function is deployed
3. Try a hard refresh of the admin panel (Ctrl+Shift+R)
4. Check browser console for errors

### Issue 2: "Bad credentials" or "Not Found"

**Cause:** GitHub token is missing or invalid

**Solution:**
1. Set up GitHub token (see Step 1)
2. Make sure token has **repo** scope
3. Verify token is not expired

### Issue 3: Function Times Out

**Cause:** GitHub API is slow or token is invalid

**Solution:**
1. Check GitHub status: https://www.githubstatus.com/
2. Verify token is valid
3. Try again in a few minutes

### Issue 4: "Resource not accessible by integration"

**Cause:** Token doesn't have correct permissions

**Solution:**
1. Regenerate token with **repo** scope (not just public_repo)
2. Update token in Netlify environment variables

## Debug Checklist

Use this checklist to diagnose the issue:

- [ ] GitHub token is created
- [ ] Token has **repo** scope
- [ ] Token is added to Netlify environment variables
- [ ] Site has been redeployed after adding token
- [ ] Netlify function `update-station` is listed in Functions tab
- [ ] Browser console shows no CORS errors
- [ ] Netlify function logs show the request is received
- [ ] Netlify function logs show "GITHUB_TOKEN exists: true"

## Testing the Fix

After setting up the GitHub token and redeploying:

1. Go to: https://stationprofiles.netlify.app/admin/
2. Open browser console (F12)
3. Try to delete a station
4. Check console for any errors
5. Check Netlify function logs
6. If it works, you should see:
   - Success message in the admin panel
   - Station removed from the list
   - Commit in your GitHub repository

## What the Logs Will Show

### If Token is Missing:
```
GITHUB_TOKEN exists: false
GITHUB_TOKEN is not set in environment variables!
```

### If Request Body is Missing:
```
Received event.body: undefined
Missing fields - action: undefined stationId: undefined
```

### If Everything is Working:
```
GITHUB_TOKEN exists: true
Received event.body: {"action":"delete","stationId":"krvb"}
Parsed body: { action: 'delete', stationId: 'krvb' }
Extracted values - action: delete stationId: krvb
```

## Next Steps

1. **Set up the GitHub token** (this is required!)
2. **Redeploy your site**
3. **Try deleting a station**
4. **Check the function logs** to see what's happening
5. **Report back** with what you see in the logs

## Need More Help?

If you've followed all these steps and it's still not working:

1. Share the Netlify function logs
2. Share any browser console errors
3. Confirm the GitHub token is set correctly
4. Check if the function is being called at all

The detailed logging I added will help us pinpoint exactly where the issue is!