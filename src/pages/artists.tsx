import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, User, Hourglass } from 'lucide-react';
import { artists, Artist } from '@/data/artists';
const ArtistsPage = () => {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArtists = useMemo(() => {
    if (!searchTerm) return artists;
    return artists.filter((artist) =>
      artist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const otherArtists = artists.filter(artist => artist.id !== selectedArtist?.id);

  if (selectedArtist) {
    return (
      <div className="container mx-auto p-4 animate-fade-in">
        <Button variant="outline" onClick={() => setSelectedArtist(null)} className="mb-8">
          &larr; Back to All Artists
        </Button>
        <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
            <div className="w-full md:w-1/3 flex-shrink-0">
                 <Image
                    src={selectedArtist.image}
                    alt={`Profile photo of ${selectedArtist.name}`}
                    width={400}
                    height={400}
                    className="w-full h-auto object-cover rounded-lg shadow-lg"
                    data-ai-hint={selectedArtist.dataAiHint}
                />
            </div>
            <div className="flex-grow">
                <h1 className="text-5xl font-extrabold mb-4">{selectedArtist.name}</h1>
                <p className="text-lg text-muted-foreground">{selectedArtist.bio}</p>
            </div>
        </div>

        {/* Media Coming Soon Canvas */}
        <Card className="mb-8 shadow-lg bg-secondary/50">
          <CardHeader>
            <CardTitle className="flex items-center">
                <Hourglass className="mr-3 text-primary"/>
                Media Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
                We're working hard to bring you music and videos from {selectedArtist.name}. Check back soon!
            </p>
          </CardContent>
        </Card>

        {/* Other Artists Gallery */}
        <h2 className="text-3xl font-bold mt-12 mb-6 text-center">Discover Other Artists</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {otherArtists.map((artist) => (
            <div key={artist.id} className="cursor-pointer group" onClick={() => setSelectedArtist(artist)}>
              <Image
                src={artist.image}
                alt={artist.name}
                width={200}
                height={200}
                className="rounded-full object-cover w-full aspect-square transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={artist.dataAiHint}
              />
              <p className="mt-2 text-center font-semibold">{artist.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Featured Artists</h1>

      {/* Search Bar */}
      <div className="relative mb-8 max-w-lg mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for an artist..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredArtists.map((artist) => (
          <Card
            key={artist.id}
            className="text-center cursor-pointer group p-4 hover:shadow-primary/20 hover:shadow-lg transition-shadow duration-300"
            onClick={() => setSelectedArtist(artist)}
          >
            <CardContent className="flex flex-col items-center justify-center">
              <div className="relative overflow-hidden rounded-full shadow-lg h-32 w-32 mb-4">
                 <Image
                  src={artist.image}
                  alt={`Profile photo of ${artist.name}`}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-300"
                  data-ai-hint={artist.dataAiHint}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <User className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">{artist.name}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
       {filteredArtists.length === 0 && (
        <p className="text-center text-muted-foreground mt-12">No artists found matching your search.</p>
      )}
    </div>
  );
};

export default ArtistsPage;