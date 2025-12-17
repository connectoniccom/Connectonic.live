'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Play, List, User } from 'lucide-react';
import Link from 'next/link';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
}

interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  itemCount: number;
}

const YouTube = () => {
  const router = useRouter();
  const { user, accessToken, signInWithGoogle } = useAuth();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = router.query.q as string;

  useEffect(() => {
    if (user && accessToken) {
      fetchYouTubeData();
    }
  }, [user, accessToken]);

  const fetchYouTubeData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch user's channel
      const channelResponse = await fetch(
        'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const channelData = await channelResponse.json();

      if (channelData.items && channelData.items.length > 0) {
        const channelId = channelData.items[0].id;

        // Fetch user's videos
        const videosResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=10`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const videosData = await videosResponse.json();

        const videoItems: YouTubeVideo[] = videosData.items?.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.medium.url,
          publishedAt: item.snippet.publishedAt,
        })) || [];

        setVideos(videoItems);

        // Fetch user's playlists
        const playlistsResponse = await fetch(
          'https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&maxResults=10',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const playlistsData = await playlistsResponse.json();

        const playlistItems: YouTubePlaylist[] = playlistsData.items?.map((item: any) => ({
          id: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails?.medium?.url || '',
          itemCount: item.contentDetails?.itemCount || 0,
        })) || [];

        setPlaylists(playlistItems);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch YouTube data');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>YouTube Integration</CardTitle>
            <CardDescription>Login with Google to access your YouTube account</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={signInWithGoogle} className="w-full">
              Login with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>YouTube Permissions</CardTitle>
            <CardDescription>Grant YouTube access to view your content</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={signInWithGoogle} className="w-full">
              Grant YouTube Access
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your YouTube Content</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      {loading && (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-center text-destructive">{error}</div>
      )}

      {!loading && !error && (
        <>
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Play className="mr-2" />
              Your Videos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <Card key={video.id}>
                  <CardContent className="p-4">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <h3 className="font-semibold text-sm line-clamp-2">{video.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </p>
                    <Button
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
                    >
                      Watch
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            {videos.length === 0 && (
              <p className="text-center text-muted-foreground">No videos found</p>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <List className="mr-2" />
              Your Playlists
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlists.map((playlist) => (
                <Card key={playlist.id}>
                  <CardContent className="p-4">
                    {playlist.thumbnail && (
                      <img
                        src={playlist.thumbnail}
                        alt={playlist.title}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    )}
                    <h3 className="font-semibold text-sm line-clamp-2">{playlist.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {playlist.itemCount} videos
                    </p>
                    <Button
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => window.open(`https://www.youtube.com/playlist?list=${playlist.id}`, '_blank')}
                    >
                      View Playlist
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            {playlists.length === 0 && (
              <p className="text-center text-muted-foreground">No playlists found</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default YouTube;