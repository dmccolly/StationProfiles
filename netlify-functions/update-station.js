const { Octokit } = require('@octokit/rest');

// GitHub configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'dmccolly';
const REPO = 'StationProfiles';
const BRANCH = 'main';

console.log('GITHUB_TOKEN exists:', !!GITHUB_TOKEN);

if (!GITHUB_TOKEN) {
  console.error('GITHUB_TOKEN is not set in environment variables!');
}

const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('Raw event.body:', event.body);
    console.log('Type of event.body:', typeof event.body);
    
    // Handle both string and already-parsed body
    let parsedBody;
    if (typeof event.body === 'string') {
      parsedBody = JSON.parse(event.body);
    } else {
      parsedBody = event.body;
    }
    
    console.log('Parsed body:', parsedBody);
    
    const { action, stationId, stationData } = parsedBody || {};
    console.log('Extracted values - action:', action, 'stationId:', stationId);

    if (!action || !stationId) {
      console.error('Missing fields - action:', action, 'stationId:', stationId);
      console.error('Full event:', JSON.stringify(event, null, 2));
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields: action, stationId',
          received: { 
            action, 
            stationId, 
            bodyType: typeof event.body,
            hasBody: !!event.body,
            bodyContent: event.body 
          }
        })
      };
    }

    let result;

    switch (action) {
      case 'update':
      case 'create':
        if (!stationData) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Missing stationData for update/create' })
          };
        }
        result = await updateStationFile(stationId, stationData);
        break;

      case 'delete':
        result = await deleteStationFile(stationId);
        break;

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action. Use: update, create, or delete' })
        };
    }

    // Update index.json after any change
    await updateIndexFile();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Station ${action}d successfully`,
        data: result
      })
    };

  } catch (error) {
      console.error('=== ERROR IN MAIN HANDLER ===');
      console.error('Error message:', error.message);
      console.error('Error status:', error.status);
      console.error('Error name:', error.name);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
          error: 'Internal server error',
          status: error.status,
          details: error.toString()
      })
    };
  }
};

async function updateStationFile(stationId, stationData) {
  const path = `public/data/stations/${stationId}.json`;
  const content = JSON.stringify(stationData, null, 2);
  const contentEncoded = Buffer.from(content).toString('base64');

  try {
    // Try to get existing file to get its SHA
    const { data: existingFile } = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: path,
      ref: BRANCH
    });

    // Update existing file
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: path,
      message: `Update station: ${stationId}`,
      content: contentEncoded,
      branch: BRANCH,
      sha: existingFile.sha
    });

    return response.data;

  } catch (error) {
    if (error.status === 404) {
      // File doesn't exist, create it
      const response = await octokit.repos.createOrUpdateFileContents({
        owner: OWNER,
        repo: REPO,
        path: path,
        message: `Create station: ${stationId}`,
        content: contentEncoded,
        branch: BRANCH
      });

      return response.data;
    }
    throw error;
  }
}

async function deleteStationFile(stationId) {
  const path = `public/data/stations/${stationId}.json`;

  try {
    // Get file to get its SHA
    const { data: existingFile } = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: path,
      ref: BRANCH
    });

    // Delete file
    const response = await octokit.repos.deleteFile({
      owner: OWNER,
      repo: REPO,
      path: path,
      message: `Delete station: ${stationId}`,
      branch: BRANCH,
      sha: existingFile.sha
    });

    return response.data;

  } catch (error) {
    if (error.status === 404) {
      throw new Error(`Station file not found: ${stationId}`);
    }
    throw error;
  }
}

async function updateIndexFile() {
  const stationsPath = 'public/data/stations';
  
  try {
    // Get all files in stations directory
    const { data: files } = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: stationsPath,
      ref: BRANCH
    });

    // Filter for JSON files (excluding index.json)
    const stationFiles = files
      .filter(file => file.name.endsWith('.json') && file.name !== 'index.json')
      .map(file => file.name.replace('.json', ''));

    // Create index.json content
    const indexContent = JSON.stringify({ stations: stationFiles }, null, 2);
    const indexEncoded = Buffer.from(indexContent).toString('base64');
    const indexPath = `${stationsPath}/index.json`;

    // Get existing index.json SHA
    const { data: existingIndex } = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: indexPath,
      ref: BRANCH
    });

    // Update index.json
    await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: indexPath,
      message: 'Update stations index',
      content: indexEncoded,
      branch: BRANCH,
      sha: existingIndex.sha
    });

  } catch (error) {
    console.error('Error updating index:', error);
    throw error;
  }
}