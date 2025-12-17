import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { animations, AnimationAsset } from '@/data/animations';
import styles from '@/styles/Animations.module.css';

const AnimationsPage = () => {
  const [activeTab, setActiveTab] = useState('stickers');

  const handleShare = async (asset: AnimationAsset) => {
    const shareUrl = `${window.location.origin}/animations/${asset.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: asset.title,
          text: `Check out this animation: ${asset.title}`,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const renderGrid = (type: 'Sticker' | 'GIF' | 'Emoji') => {
    const assets = animations.filter((a) => a.type === type);
    return (
      <div className={styles.grid}>
        {assets.map((asset) => (
          <Card key={asset.id} className={styles.card}>
            <CardContent className={styles.cardContent}>
              <Image
                src={asset.src}
                alt={asset.title}
                width={200}
                height={200}
                className={styles.cardImage}
                unoptimized={asset.type === 'GIF'}
              />
              <div className={styles.cardOverlay}>
                <p className={styles.cardTitle}>{asset.title}</p>
                <Button size="sm" onClick={() => handleShare(asset)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Amazing Animations</h1>
      <p className={styles.subtitle}>
        Discover and share fun stickers, GIFs, and emojis.
      </p>

      <Tabs defaultValue="stickers" className="w-full" onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="stickers">Stickers</TabsTrigger>
          <TabsTrigger value="gifs">GIFs</TabsTrigger>
          <TabsTrigger value="emojis">Emojis</TabsTrigger>
        </TabsList>
        <TabsContent value="stickers">{renderGrid('Sticker')}</TabsContent>
        <TabsContent value="gifs">{renderGrid('GIF')}</TabsContent>
        <TabsContent value="emojis">{renderGrid('Emoji')}</TabsContent>
      </Tabs>
    </div>
  );
};

export default AnimationsPage;