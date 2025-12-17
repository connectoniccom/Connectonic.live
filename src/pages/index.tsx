'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Music, Video, Search, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';

// Define types for search results
interface SearchResult {
  link: string;
  title: string;
  snippet: string;
}

interface SearchResponse {
  data: SearchResult[];
}

export default function Page() {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const functions = getFunctions(app);

  const handleSearch = async () => {
    if (!query.trim()) return;

    // Check if it's a URL or contains youtube
    const isUrl = query.includes('youtube.com') || /^https?:\/\//.test(query) || /\.(com|org|net|edu|gov)$/.test(query);

    if (isUrl || query.toLowerCase().includes('youtube')) {
      // Redirect to YouTube page
      window.location.href = `/youtube?q=${encodeURIComponent(query)}`;
      return;
    }

    setLoading(true);
    try {
      const callable = httpsCallable(functions, 'mySearchEndpoint');
      const res = await callable({ searchQuery: query });
      const responseData = res.data as SearchResponse;
      setResults(responseData.data);
      setShowSearch(true);
    } catch (error) {
      console.error(error);
      setResults([]);
      setShowSearch(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (showSearch) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-background p-4">
        <div className="w-full max-w-4xl">
          <Button
            onClick={() => setShowSearch(false)}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>Your query: "{query}"</CardDescription>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((item, index) => (
                    <div key={index} className="border-b pb-2 last:border-b-0">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        {item.title}
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">{item.snippet}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No results found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-background">
            <main className="flex flex-col items-center justify-center flex-1 p-4 md:p-8">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 text-primary">
                    Connectonic.com
                </h1>
                <p className="max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground mb-8">
                    Your ultimate hub for discovering new music and connecting with artists. Explore tracks, watch videos, and dive into the world of sound.
                </p>
                <div className="w-full max-w-md mb-8">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Ask me anything..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="flex-1"
                        />
                        <Button onClick={handleSearch} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                    <Button asChild size="lg">
                        <Link href="/artists">
                            <Music className="mr-2 h-5 w-5" /> Explore Artists
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="secondary">
                        <Link href="/artists">
                            <Video className="mr-2 h-5 w-5" /> Watch Videos
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/search">
                            <Search className="mr-2 h-5 w-5" /> Advanced Search
                        </Link>
                    </Button>
                </div>

                <div className="w-full max-w-4xl grid gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>What is Connectonic?</CardTitle>
                            <CardDescription>A revolutionary platform for music lovers.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-left text-muted-foreground">
                                Connectonic is designed to bridge the gap between artists and their fans. We provide a space for creators to share their work and for listeners to discover their next favorite song.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <footer className="w-full py-6 border-t mt-12">
                <p className="text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Connectonic.com. All Rights Reserved.
                </p>
            </footer>
        </div>
    );
}