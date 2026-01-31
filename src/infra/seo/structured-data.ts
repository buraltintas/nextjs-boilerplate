/**
 * JSON-LD Schema.org structured data utilities
 */

export interface Organization {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(org: Organization) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: org.url,
    logo: org.logo,
    sameAs: org.sameAs,
  };
}

/**
 * Generate Breadcrumb schema
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate WebSite schema
 */
export function generateWebSiteSchema(url: string, name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url,
    name,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}
