const { execSync } = require('child_process');

// GitHub configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'dmccolly';
const REPO = 'StationProfiles';

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
        const getCmd = `curl -s -H "Authorization: token ${GITHUB_TOKEN}" https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
        const fileInfo = JSON.parse(execSync(getCmd).toString());
        
        if (!fileInfo.sha) {
          throw new Error('File not found');
        }
        
        // Delete file
        const deleteCmd = `curl -X DELETE -H "Authorization: token ${GITHUB_TOKEN}" -H "Content-Type: application/json" https://api.github.com/repos/${OWNER}/${REPO}/contents/${path} -d '{"message":"Delete station: ${stationId}","sha":"${fileInfo.sha}"}'`;
        const deleteResult = execSync(deleteCmd).toString();
        
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
          const existingFile = JSON.parse(execSync(getCmd).toString());
          sha = existingFile.sha;
        } catch (e) {
          // File doesn't exist, that's ok for create
        }
        
        // Create or update file
        const updateData = {
          message: sha ? `Update station: ${stationId}` : `Create station: ${stationId}`,
          content: content
        };
        if (sha) updateData.sha = sha;
        
        const updateCmd = `curl -X PUT -H "Authorization: token ${GITHUB_TOKEN}" -H "Content-Type: application/json" https://api.github.com/repos/${OWNER}/${REPO}/contents/${path} -d '${JSON.stringify(updateData)}'`;
        execSync(updateCmd);
        
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
    console.error('Error:', error);
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
  const listCmd = `curl -s -H "Authorization: token ${GITHUB_TOKEN}" https://api.github.com/repos/${OWNER}/${REPO}/contents/public/data/stations`;
  const files = JSON.parse(execSync(listCmd).toString());
  
  const stationFiles = files
    .filter(f => f.name.endsWith('.json') && f.name !== 'index.json')
    .map(f => f.name.replace('.json', ''));
  
  const indexContent = JSON.stringify({ stations: stationFiles }, null, 2);
  const indexBase64 = Buffer.from(indexContent).toString('base64');
  
  // Get current index SHA
  const indexPath = 'public/data/stations/index.json';
  const getIndexCmd = `curl -s -H "Authorization: token ${GITHUB_TOKEN}" https://api.github.com/repos/${OWNER}/${REPO}/contents/${indexPath}`;
  const indexInfo = JSON.parse(execSync(getIndexCmd).toString());
  
  // Update index
  const updateIndexData = {
    message: 'Update station index',
    content: indexBase64,
    sha: indexInfo.sha
  };
  
  const updateIndexCmd = `curl -X PUT -H "Authorization: token ${GITHUB_TOKEN}" -H "Content-Type: application/json" https://api.github.com/repos/${OWNER}/${REPO}/contents/${indexPath} -d '${JSON.stringify(updateIndexData)}'`;
  execSync(updateIndexCmd);
}
