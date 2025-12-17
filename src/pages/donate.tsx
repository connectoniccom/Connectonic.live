import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import styles from '@/styles/Donate.module.css';

const DonatePage = () => {
    const paymentUrl = "https://flutterwave.com/pay/ugxeversend?email=matovuasuman481@gmail.com&firstname=Matovu&lastname=Asuman";

    return (
        <div className={styles.container}>
            <Card className={styles.card}>
                <CardHeader>
                    <div className={styles.iconWrapper}>
                        <Heart className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className={styles.title}>Support Connectonic</CardTitle>
                    <CardDescription className={styles.description}>
                        Your contribution helps us keep the music playing and support artists everywhere.
                    </CardDescription>
                </CardHeader>
                <CardContent className={styles.content}>
                   <p className="text-muted-foreground">
                    Click the button below to make a secure donation. We appreciate your support!
                   </p>
                   <Button asChild size="lg">
                        <Link href={paymentUrl} target="_blank" rel="noopener noreferrer">
                            Donate Now
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                   </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default DonatePage;