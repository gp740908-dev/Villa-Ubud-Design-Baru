import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { supabase } from '../lib/supabase';
import { Post } from '../types';

interface JournalPostProps {
  slug: string;
  onNavigate: (view: 'journal' | '404', slug?: string) => void;
}

export const JournalPost: React.FC<JournalPostProps> = ({ slug, onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error || !data || !data.is_published) {
             onNavigate('404');
             return;
        }
        setPost(data);
      } catch (err) {
        console.error(err);
        onNavigate('404');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, onNavigate]);

  useEffect(() => {
    if (!post) return;
    
    // Smooth fade in
    const ctx = gsap.context(() => {
      gsap.from(".post-element", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, [post]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (loading) return <div className="h-screen w-full bg-canvas flex items-center justify-center text-ink uppercase tracking-widest text-xs">Loading Article...</div>;
  if (!post) return null;

  return (
    <div ref={containerRef} className="bg-canvas min-h-screen pt-32 pb-24 text-ink">
      
      {/* Back Button */}
      <div className="fixed top-24 left-6 z-40 md:top-32 md:left-12 mix-blend-difference text-canvas md:text-ink">
        <button 
            onClick={() => onNavigate('journal')}
            className="flex items-center gap-2 group"
        >
            <div className="w-8 h-px bg-current transition-all group-hover:w-12"></div>
            <span className="font-sans text-[10px] uppercase tracking-widest">Back to Journal</span>
        </button>
      </div>

      <article className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <header className="text-center mb-16 md:mb-24">
            <div className="post-element flex items-center justify-center gap-3 mb-6 opacity-60">
                <span className="font-sans text-[10px] uppercase tracking-widest">{post.category}</span>
                <span className="w-1 h-1 rounded-full bg-ink"></span>
                <span className="font-sans text-[10px] uppercase tracking-widest">{formatDate(post.published_at)}</span>
            </div>
            <h1 className="post-element font-serif text-4xl md:text-7xl leading-tight mb-12">
                {post.title}
            </h1>
            <div className="post-element w-full aspect-video overflow-hidden rounded-sm">
                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
            </div>
        </header>

        {/* Content */}
        <div className="post-element font-serif text-lg leading-loose opacity-90 space-y-8">
             {/* Custom Styles for HTML content */}
             <style>{`
                .prose p { margin-bottom: 2rem; }
                .prose h2 { font-family: 'Playfair Display', serif; font-size: 2rem; margin-top: 3rem; margin-bottom: 1.5rem; color: #537F5D; }
                .prose h3 { font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-top: 2.5rem; margin-bottom: 1rem; color: #537F5D; }
                .prose blockquote { border-left: 2px solid #9BB784; padding-left: 1.5rem; font-style: italic; margin: 2rem 0; color: #537F5D; opacity: 0.8; }
                .prose ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 2rem; }
                .prose img { width: 100%; border-radius: 2px; margin: 3rem 0; }
                .prose strong { font-weight: 600; color: #537F5D; }
                .prose a { text-decoration: underline; text-underline-offset: 4px; color: #537F5D; }
             `}</style>
             
             <div 
                className="prose"
                dangerouslySetInnerHTML={{ __html: post.content }} 
             />
        </div>

        {/* Footer / Share */}
        <div className="post-element mt-24 pt-12 border-t border-ink/10 flex justify-between items-center">
            <span className="font-sans text-[10px] uppercase tracking-widest opacity-50">Share this story</span>
            <div className="flex gap-4">
                {['Facebook', 'Twitter', 'Pinterest'].map(platform => (
                    <button key={platform} className="font-sans text-[10px] uppercase tracking-widest hover:text-terrace transition-colors">
                        {platform}
                    </button>
                ))}
            </div>
        </div>

      </article>
    </div>
  );
};
