
import { getAdminApp } from '@/lib/firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import fetch from 'node-fetch';

export default async (req, res) => {
  const { filePath } = req.query;

  if (!filePath) {
    return res.status(400).json({ error: 'Missing filePath parameter' });
  }

  try {
    // Initialize Admin SDK
    const adminApp = getAdminApp();
    const bucket = getStorage(adminApp).bucket();
    
    // Create a reference to the file
    const file = bucket.file(filePath);

    const [exists] = await file.exists();
    if (!exists) {
        return res.status(404).json({ error: 'File not found' });
    }

    // Get a signed URL for the file
    const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15-minute expiry
    });

    // Instead of redirecting, fetch the image on the server and stream it
    const imageResponse = await fetch(signedUrl);
    
    if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image from signed URL: ${imageResponse.statusText}`);
    }

    // Get the image buffer
    const imageBuffer = await imageResponse.arrayBuffer();

    // Set appropriate headers and send the image data
    res.setHeader('Content-Type', imageResponse.headers.get('Content-Type') || 'image/jpeg');
    res.setHeader('Content-Length', imageResponse.headers.get('Content-Length') || imageBuffer.byteLength);
    res.status(200).send(Buffer.from(imageBuffer));

  } catch (error) {
    console.error('Download proxy error:', error);
    res.status(500).json({ error: 'Internal server error during file retrieval.' });
  }
};
