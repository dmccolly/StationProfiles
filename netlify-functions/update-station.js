const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'dmccolly';
const REPO = 'StationProfiles';
const BRANCH = 'main';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'StationProfiles-Admin',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body || '{}'));
        } else {
          reject(new Error(`GitHub API error: ${res.statusCode} - ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

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
        const fileInfo = await makeRequest('GET', `/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`);
        
        // Delete file
        await makeRequest('DELETE', `/repos/${OWNER}/${REPO}/contents/${path}`, {
          message: `Delete station: ${stationId}`,
          sha: fileInfo.sha,
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
          const existingFile = await makeRequest('GET', `/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`);
          sha = existingFile.sha;
        } catch (e) {
          // File doesn't exist
        }
        
        // Create or update
        const updateData = {
          message: sha ? `Update station: ${stationId}` : `Create station: ${stationId}`,
          content: content,
          branch: BRANCH
        };
        if (sha) updateData.sha = sha;
        
        await makeRequest('PUT', `/repos/${OWNER}/${REPO}/contents/${path}`, updateData);
        
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
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};

async function updateIndex() {
  const files = await makeRequest('GET', `/repos/${OWNER}/${REPO}/contents/public/data/stations?ref=${BRANCH}`);
  
  const stationFiles = files
    .filter(f => f.name.endsWith('.json') && f.name !== 'index.json')
    .map(f => f.name.replace('.json', ''));
  
  const indexContent = JSON.stringify({ stations: stationFiles }, null, 2);
  const indexBase64 = Buffer.from(indexContent).toString('base64');
  
  const indexPath = 'public/data/stations/index.json';
  const indexFile = await makeRequest('GET', `/repos/${OWNER}/${REPO}/contents/${indexPath}?ref=${BRANCH}`);
  
  await makeRequest('PUT', `/repos/${OWNER}/${REPO}/contents/${indexPath}`, {
    message: 'Update station index',
    content: indexBase64,
    sha: indexFile.sha,
    branch: BRANCH
  });
}
