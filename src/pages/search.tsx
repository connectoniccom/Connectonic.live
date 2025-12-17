'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, ArrowLeft, Loader2, ExternalLink, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';
import { useRouter } from 'next/router';

interface SearchResult {
  title: string;
  link: string;
  snippet?: string;
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const functions = getFunctions(app);

  // Load query from URL params on mount
  useEffect(() => {
    if (router.query.q) {
      const searchQuery = router.query.q as string;
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [router.query.q]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const callable = httpsCallable<
        { searchQuery: string },
        { status: string; data: SearchResult[] }
      >(functions, 'mySearchEndpoint');
      
      const response = await callable({ searchQuery: searchQuery });
      
      if (response.data.status === 'success') {
        setResults(response.data.data || []);
      } else {
        setError('Search completed but no results format was valid');
        setResults([]);
      }
    } catch (err: any) {
      console.error('Search error:', err);
      
      // Handle specific Firebase errors
      if (err.code === 'unauthenticated') {
        setError('Please sign in to perform searches');
      } else if (err.code === 'invalid-argument') {
        setError('Invalid search query. Please try again.');
      } else if (err.code === 'internal') {
        setError('Search service is temporarily unavailable. Please try again later.');
      } else {
        setError(`Search failed: ${err.message || 'Unknown error occurred'}`);
      }
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      // Update URL with search query
      router.push(`/search?q=${encodeURIComponent(query)}`, undefined, { shallow: true });
      performSearch(query);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    setError(null);
    setHasSearched(false);
    router.push('/search', undefined, { shallow: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Search</h1>
          <p className="text-muted-foreground">
            Search across Connectonic content and the web
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                placeholder="Enter your search query..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
                disabled={loading}
              />
              <Button onClick={handleSearch} disabled={loading || !query.trim()}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SearchIcon className="h-4 w-4" />
                )}
              </Button>
              {hasSearched && (
                <Button onClick={handleClearSearch} variant="outline">
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive">Error</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Searching...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        {!loading && hasSearched && !error && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                {results.length > 0
                  ? `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
                  : `No results found for "${query}"`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((item, index) => (
                    <div
                      key={index}
                      className="border-b pb-4 last:border-b-0 last:pb-0 hover:bg-accent/50 p-3 rounded-lg transition-colors"
                    >
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                      >
                        <h3 className="text-lg font-semibold text-primary group-hover:underline flex items-center gap-2">
                          {item.title}
                          <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        {item.snippet && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {item.snippet}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2 truncate">
                          {item.link}
                        </p>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or check your spelling
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Initial State */}
        {!loading && !hasSearched && !error && (
          <Card>
            <CardHeader>
              <CardTitle>Start Searching</CardTitle>
              <CardDescription>
                Enter a query above to search across our content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Search Tips:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Use specific keywords for better results</li>
                    <li>Try different word combinations</li>
                    <li>Use quotes for exact phrase matches</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Popular Searches:</h4>
                  <div className="flex flex-wrap gap-2">
                    {['New music', 'Top artists', 'Latest videos', 'Trending songs'].map((term) => (
                      <Button
                        key={term}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setQuery(term);
                          setTimeout(() => handleSearch(), 100);
                        }}
                      >
                        {term}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}