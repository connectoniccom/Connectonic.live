'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

// A simple ID generator for mermaid
const genId = () => {
  return `mermaid-` + Math.random().toString(36).substring(2, 9)
}

interface MermaidDiagramProps {
  chart: string
}

const MermaidDiagram = ({ chart }: MermaidDiagramProps) => {
  const [html, setHtml] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const id = genId()

  useEffect(() => {
    let isMounted = true;
    import('mermaid')
      .then(mermaid => {
        if (!isMounted) return;
        mermaid.default.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          fontFamily: 'inherit',
        });
        const renderMermaid = async () => {
          try {
            const { svg } = await mermaid.default.render(id, chart);
            if(isMounted) {
              setHtml(svg);
            }
          } catch(e) {
            if(isMounted) {
              setHtml(`<p class="text-destructive-foreground">Error rendering diagram</p>`);
            }
            console.error(e);
          } finally {
            if(isMounted) {
              setIsLoading(false);
            }
          }
        };
        renderMermaid();
      })
      .catch(e => {
        if(isMounted) {
            setHtml(`<p class="text-destructive-foreground">Could not load Mermaid library.</p>`);
            setIsLoading(false);
        }
        console.error(e)
      });
      return () => { isMounted = false; }
  }, [chart, id])

  if (isLoading) {
    return <Skeleton className="w-full h-64" />
  }

  return <div className="flex justify-center" dangerouslySetInnerHTML={{ __html: html }} />
}

export default MermaidDiagram
