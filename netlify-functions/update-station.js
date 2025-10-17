const { Octokit } = require('@octokit/rest');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'dmccolly';
const REPO = 'StationProfiles';
const BRANCH = 'main';

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
  userAgent: 'StationProfiles-Admin/1.0.0'
});

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { action, stationId, stationData } = body || {};

    if (!action || !stationId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: action, stationId' })
      };
    }

    const path = `public/data/stations/${stationId}.json`;
    
    switch (action) {
      case 'delete':
        // Get file SHA
        const { data: fileToDelete } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner: OWNER,
          repo: REPO,
          path: path,
          ref: BRANCH
        });
        
        // Delete file
        await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
          owner: OWNER,
          repo: REPO,
          path: path,
          message: `Delete station: ${stationId}`,
          sha: fileToDelete.sha,
          branch: BRANCH
        });
        
        // Update index
        await updateIndex();
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'Station deleted' })
        };
        
      case 'update':
      case 'create':
        if (!stationData) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Missing stationData' })
          };
        }
        
        const content = Buffer.from(JSON.stringify(stationData, null, 2)).toString('base64');
        
        // Try to get existing file
        let sha = null;
        try {
          const { data: existingFile } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: OWNER,
            repo: REPO,
            path: path,
            ref: BRANCH
          });
          sha = existingFile.sha;
        } catch (e) {
          // File doesn't exist
        }
        
        // Create or update
        const updateParams = {
          owner: OWNER,
          repo: REPO,
          path: path,
          message: sha ? `Update station: ${stationId}` : `Create station: ${stationId}`,
          content: content,
          branch: BRANCH
        };
        if (sha) updateParams.sha = sha;
        
        await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', updateParams);
        
        // Update index
        await updateIndex();
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'Station saved' })
        };
        
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Error status:', error.status);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        status: error.status
      })
    };
  }
};

async function updateIndex() {
  const { data: files } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: OWNER,
    repo: REPO,
    path: 'public/data/stations',
    ref: BRANCH
  });
  
  const stationFiles = files
    .filter(f => f.name.endsWith('.json') && f.name !== 'index.json')
    .map(f => f.name.replace('.json', ''));
  
  const indexContent = JSON.stringify({ stations: stationFiles }, null, 2);
  const indexBase64 = Buffer.from(indexContent).toString('base64');
  
  const indexPath = 'public/data/stations/index.json';
  const { data: indexFile } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: OWNER,
    repo: REPO,
    path: indexPath,
    ref: BRANCH
  });
  
  await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: OWNER,
    repo: REPO,
    path: indexPath,
    message: 'Update station index',
    content: indexBase64,
    sha: indexFile.sha,
    branch: BRANCH
  });
}
