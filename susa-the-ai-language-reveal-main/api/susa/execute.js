// API endpoint to execute SUSA code
// This would typically be deployed as a serverless function

const { spawn } = require('child_process');
const path = require('path');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { code, timeout = 10000 } = req.body;

    if (!code) {
      res.status(400).json({ error: 'No code provided' });
      return;
    }

    // Try to execute SUSA code using the Python interpreter
    const susaPath = path.join(process.cwd(), '..', '..', 'susa.py');
    
    const child = spawn('python', [susaPath, '-c', code], {
      timeout: timeout,
      cwd: path.join(process.cwd(), '..', '..')
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        res.status(200).json({
          success: true,
          output: output.trim(),
          stderr: errorOutput.trim()
        });
      } else {
        res.status(200).json({
          success: false,
          error: `Process exited with code ${code}`,
          stderr: errorOutput.trim(),
          output: output.trim()
        });
      }
    });

    child.on('error', (error) => {
      res.status(200).json({
        success: false,
        error: error.message,
        stderr: errorOutput.trim(),
        output: output.trim()
      });
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}