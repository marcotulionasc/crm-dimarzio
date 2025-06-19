/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    // Configurações do CRM Dimarzio Seguros
    NEXT_PUBLIC_CRM_TENANT_ID: '6',
    NEXT_PUBLIC_CRM_COMPANY_NAME: 'Dimarzio Seguros',
    NEXT_PUBLIC_CRM_API_BASE_URL: 'https://backend-ingressar.onrender.com/metropole/v1',
    NEXT_PUBLIC_CRM_WHATSAPP_TEMPLATE: 'Olá {nome}, estamos entrando em contato sobre seu interesse em nossos produtos de seguros.',
    NEXT_PUBLIC_CRM_DEFAULT_PRODUCT: 'dimarzio-auto',
  },
}

export default nextConfig