/**
 * SEO Infrastructure
 */

export { generateMetadata, generateDynamicMetadata, metadataPresets, type SEOConfig } from '@/infra/seo/metadata';
export {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateWebSiteSchema,
  type Organization,
  type BreadcrumbItem,
} from '@/infra/seo/structured-data';
