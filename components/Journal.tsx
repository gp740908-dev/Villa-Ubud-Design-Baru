import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '../lib/supabase';
import { Post } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface JournalProps {
  onNavigate: (view: 'journal-post', slug: string) => void;
}

export const Journal: React.FC<JournalProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredArchive, setHoveredArchive] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      if (data) setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading || posts.length === 0) return;

    const ctx = gsap.context(() => {
      // 1. Reveal Animation for Hero
      gsap.from('.hero-reveal', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out'
      });

      // 2. Parallax and Reveal for Grid Items
      gsap.utils.toArray('.journal-card').forEach((card: any) => {
        gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
            }
        });

        const img = card.querySelector('img');
        if (img) {
            gsap.to(img, {
                yPercent: 10,
                ease: 'none',
                scrollTrigger: {
                    trigger: card,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }
      });

      // 3. Archive Reveal
      gsap.from('.archive-row', {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '#archive-list',
            start: "top 80%",
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, [loading, posts]);

  // Date Formatter
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  };

  if (loading) {
    return <div className="min-h-screen bg-canvas flex items-center justify-center text-ink font-sans uppercase tracking-widest text-xs">Loading Journal...</div>;
  }

  // Separation Logic
  const featuredPost = posts[0];
  const gridPosts = posts.slice(1, 5); // Next 4 posts
  const archivePosts = posts.slice(5); // Remaining posts

  // Masonry Split
  const leftColPosts = gridPosts.filter((_, i) => i % 2 === 0);
  const rightColPosts = gridPosts.filter((_, i) => i % 2 !== 0);

  return (
    <div ref={containerRef} className="bg-canvas min-h-screen pt-32 md:pt-48 px-6 md:px-24 pb-24 text-ink">
      
      {/* A. Header */}
      <div className="text-center mb-24 md:mb-32">
        <h1 className="hero-reveal font-serif text-6xl md:text-9xl mb-4">The Journal</h1>
        <p className="hero-reveal font-sans text-xs uppercase tracking-[0.25em] text-ink/60">
            Stories from the heart of Ubud
        </p>
      </div>

      {/* B. Featured Story (Hero) */}
      {featuredPost && (
        <section 
            className="hero-reveal mb-32 md:mb-48 group cursor-pointer"
            onClick={() => onNavigate('journal-post', featuredPost.slug)}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                {/* Image */}
                <div className="relative w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden">
                    <img 
                        src={featuredPost.image_url} 
                        alt={featuredPost.title}
                        className="w-full h-[120%] object-cover object-center -mt-10 group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                </div>
                {/* Content */}
                <div className="flex flex-col items-start">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="font-sans text-[10px] uppercase tracking-widest text-matcha">{featuredPost.category}</span>
                        <span className="w-1 h-1 rounded-full bg-matcha"></span>
                        <span className="font-sans text-[10px] uppercase tracking-widest text-ink/50">{formatDate(featuredPost.published_at)}</span>
                    </div>
                    <h2 className="font-serif text-5xl md:text-7xl leading-[1.1] mb-8 group-hover:text-terrace transition-colors duration-300">
                        {featuredPost.title}
                    </h2>
                    <p className="font-sans text-base md:text-lg leading-relaxed opacity-70 mb-8 max-w-md line-clamp-3">
                        {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-2 border-b border-ink pb-1 group-hover:border-terrace transition-colors">
                        <span className="font-sans text-xs uppercase tracking-widest">Read Story</span>
                        <span className="text-lg">&rarr;</span>
                    </div>
                </div>
            </div>
        </section>
      )}

      {/* C. The Grid (Staggered Layout) */}
      <section className="mb-32 md:mb-48">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            
            {/* Left Column */}
            <div className="flex flex-col gap-24 md:gap-48">
                {leftColPosts.map(post => (
                    <ArticleCard key={post.id} post={post} formatDate={formatDate} onClick={() => onNavigate('journal-post', post.slug)} />
                ))}
            </div>

            {/* Right Column (Offset) */}
            <div className="flex flex-col gap-24 md:gap-48 md:pt-32">
                {rightColPosts.map(post => (
                     <ArticleCard key={post.id} post={post} formatDate={formatDate} onClick={() => onNavigate('journal-post', post.slug)} />
                ))}
            </div>

        </div>
      </section>

      {/* D. Archive List */}
      {archivePosts.length > 0 && (
          <section id="archive-list" className="max-w-4xl mx-auto pt-12 border-t border-ink/10">
            <h4 className="font-sans text-xs uppercase tracking-widest text-ink/40 mb-12">Older Stories</h4>
            
            <div className="flex flex-col">
                {archivePosts.map(post => (
                    <div 
                        key={post.id}
                        onClick={() => onNavigate('journal-post', post.slug)}
                        onMouseEnter={() => setHoveredArchive(post.image_url)}
                        onMouseLeave={() => setHoveredArchive(null)}
                        className="archive-row group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-ink/10 cursor-pointer hover:bg-ink/5 transition-colors px-4 -mx-4 relative z-10"
                    >
                        <div className="flex items-center gap-12">
                            <span className="font-sans text-[10px] uppercase tracking-widest text-ink/40 w-24">{formatDate(post.published_at)}</span>
                            <h5 className="font-serif text-xl md:text-2xl text-ink group-hover:text-terrace transition-colors">{post.title}</h5>
                        </div>
                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                            <span className="font-sans text-[10px] uppercase tracking-widest text-matcha">{post.category}</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-2 duration-300">&rarr;</span>
                        </div>

                        {/* Floating Thumbnail on Hover */}
                        <div 
                            className={`hidden md:block absolute top-1/2 left-[60%] -translate-y-1/2 w-48 aspect-[3/2] overflow-hidden pointer-events-none transition-all duration-500 z-20 shadow-xl ${hoveredArchive === post.image_url ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                            style={{ transform: `translate(-50%, -50%) rotate(${hoveredArchive === post.image_url ? '2deg' : '0deg'})` }}
                        >
                            <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
      )}

    </div>
  );
};

// Helper Component for Grid Items
const ArticleCard: React.FC<{ post: Post, formatDate: (d: string) => string, onClick: () => void }> = ({ post, formatDate, onClick }) => (
    <div onClick={onClick} className="journal-card group cursor-pointer">
        <div className="relative w-full aspect-[4/5] overflow-hidden mb-8">
            <img 
            src={post.image_url} 
            alt={post.title}
            className="w-full h-[120%] object-cover -mt-8 group-hover:scale-105 transition-transform duration-1000"
            />
        </div>
        <div className="flex items-center gap-2 mb-3 opacity-60">
            <span className="font-sans text-[10px] uppercase tracking-widest">{post.category}</span>
            <span>•</span>
            <span className="font-sans text-[10px] uppercase tracking-widest">{formatDate(post.published_at)}</span>
        </div>
        <h3 className="font-serif text-3xl md:text-4xl leading-tight mb-4 group-hover:text-terrace transition-colors">{post.title}</h3>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-500">
            <span className="font-sans text-[10px] uppercase tracking-widest">Read</span>
            <span>&rarr;</span>
        </div>
    </div>
);