'use client';

import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { AlertCircle } from 'lucide-react';

const Error = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px] dark:border-white dark:border-white/5">
        <CardContent className="text-center">
          <p className={'py-10 text-5xl'}>:(</p>
          <AlertCircle className="text-destructive mx-auto mb-4 hidden h-12 w-12" />
          <h2 className="text-foreground mb-2 text-2xl font-semibold">
            Oops! Something went wrong
          </h2>
          <p className="text-muted-foreground mb-6">
            We encountered an error while fetching content.
          </p>
          <Button
            className={'w-full dark:bg-white dark:hover:bg-neutral-300'}
            onClick={handleRetry}>
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Error;