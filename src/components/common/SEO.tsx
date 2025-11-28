import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  author?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'TradeZella - Trading Journal & Community Platform',
  description = 'The ultimate trading journal and community platform. Track your trades, analyze performance, and connect with fellow traders to improve your profitability.',
  keywords = 'trading journal, trade analysis, trading community, backtesting, playbooks, broker integration, trading performance, trade tracking',
  image = '/assets/1.png',
  url = 'https://tradezella.com/',
  author = 'TradeZella',
  type = 'website'
}) => {
  const fullTitle = title === 'TradeZella - Trading Journal & Community Platform' 
    ? title 
    : `${title} | TradeZella - Trading Journal & Community Platform`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="TradeZella" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Additional SEO Tags */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;