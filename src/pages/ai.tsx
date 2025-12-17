'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Music, FileText, ChefHat } from 'lucide-react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';

const AI = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<{ [key: string]: string }>({});

  const functions = getFunctions(app);

  const callFunction = async (functionName: string, data: any) => {
    setLoading(functionName);
    try {
      const callable = httpsCallable(functions, functionName);
      const result = await callable(data);
      setResults(prev => ({ ...prev, [functionName]: result.data as string }));
    } catch (error) {
      console.error(error);
      setResults(prev => ({ ...prev, [functionName]: 'Error occurred' }));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">AI Features</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Menu Suggestion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChefHat className="mr-2" />
              Menu Suggestion
            </CardTitle>
            <CardDescription>Generate menu suggestions for a restaurant theme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="menu-theme">Restaurant Theme</Label>
              <Input
                id="menu-theme"
                placeholder="e.g., Italian, seafood, vegan"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const value = (e.target as HTMLInputElement).value;
                    callFunction('menuSuggestion', value || 'seafood');
                  }
                }}
              />
            </div>
            <Button
              onClick={() => {
                const input = document.getElementById('menu-theme') as HTMLInputElement;
                callFunction('menuSuggestion', input.value || 'seafood');
              }}
              disabled={loading === 'menuSuggestion'}
              className="w-full"
            >
              {loading === 'menuSuggestion' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Generate Suggestion
            </Button>
            {results.menuSuggestion && (
              <div className="mt-4 p-3 bg-muted rounded">
                <p className="text-sm">{results.menuSuggestion}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Song Lyrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Music className="mr-2" />
              Song Lyrics
            </CardTitle>
            <CardDescription>Create original song lyrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="lyrics-theme">Theme</Label>
              <Input id="lyrics-theme" placeholder="e.g., love, adventure" />
            </div>
            <div>
              <Label htmlFor="lyrics-genre">Genre</Label>
              <Input id="lyrics-genre" placeholder="e.g., pop, rock" defaultValue="pop" />
            </div>
            <Button
              onClick={() => {
                const theme = (document.getElementById('lyrics-theme') as HTMLInputElement).value;
                const genre = (document.getElementById('lyrics-genre') as HTMLInputElement).value;
                callFunction('generateSongLyrics', { theme: theme || 'love', genre: genre || 'pop' });
              }}
              disabled={loading === 'generateSongLyrics'}
              className="w-full"
            >
              {loading === 'generateSongLyrics' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Generate Lyrics
            </Button>
            {results.generateSongLyrics && (
              <div className="mt-4 p-3 bg-muted rounded max-h-40 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap">{results.generateSongLyrics}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Music Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2" />
              Music Recommendations
            </CardTitle>
            <CardDescription>Get music recommendations based on mood</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="rec-mood">Mood</Label>
              <Input id="rec-mood" placeholder="e.g., happy, sad, energetic" />
            </div>
            <div>
              <Label htmlFor="rec-genre">Genre (optional)</Label>
              <Input id="rec-genre" placeholder="e.g., pop, jazz" />
            </div>
            <Button
              onClick={() => {
                const mood = (document.getElementById('rec-mood') as HTMLInputElement).value;
                const genre = (document.getElementById('rec-genre') as HTMLInputElement).value;
                callFunction('recommendMusic', { mood: mood || 'happy', genre: genre || undefined });
              }}
              disabled={loading === 'recommendMusic'}
              className="w-full"
            >
              {loading === 'recommendMusic' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Get Recommendations
            </Button>
            {results.recommendMusic && (
              <div className="mt-4 p-3 bg-muted rounded max-h-40 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap">{results.recommendMusic}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AI;