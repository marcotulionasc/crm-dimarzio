# CRM Dimarzio Seguros

Sistema de gestão de leads e vendas especializado em seguros, desenvolvido para a Dimarzio Seguros.

## 🚀 Recursos

- **Gestão de Leads**: Cadastro, visualização e edição de leads
- **Múltiplos Produtos**: Suporte para todos os tipos de seguro da Dimarzio
- **Dashboard Analítico**: Estatísticas e gráficos em tempo real
- **WhatsApp Integration**: Contato direto com leads via WhatsApp
- **Interface Responsiva**: Otimizada para desktop e mobile
- **Sistema de Status**: Acompanhamento do funil de vendas

## 📋 Produtos Suportados

- Consórcio
- Residencial
- Fiança Locatícia
- Auto
- Fiduciário
- Contato
- Vida
- Portáteis
- Saúde
- Viagem
- Rural
- Empresarial
- RC Profissional

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, Shadcn/ui
- **Charts**: Recharts
- **Toast**: Sonner
- **Forms**: React Hook Form, Zod

## ⚙️ Configuração

O sistema utiliza variáveis de ambiente para configuração:

```env
CRM_TENANT_ID=6
CRM_COMPANY_NAME=Dimarzio Seguros
CRM_API_BASE_URL=https://backend-ingressar.onrender.com/metropole/v1
CRM_WHATSAPP_TEMPLATE=Olá {nome}, estamos entrando em contato sobre seu interesse em nossos produtos de seguros.
CRM_DEFAULT_PRODUCT=dimarzio-auto
```

## 🚀 Como usar

1. **Instalação**:
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

2. **Desenvolvimento**:
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

3. **Build**:
```bash
npm run build
npm start
```

## 📊 Funcionalidades

### Dashboard
- Estatísticas gerais de leads
- Gráficos de conversão
- Análise por período
- Métricas por produto

### Gestão de Leads
- Cadastro de novos leads
- Listagem com filtros
- Edição de status
- Detalhes completos
- Contato via WhatsApp

### Relatórios
- Exportação de dados
- Análise de performance
- Funil de vendas
- ROI por canal

## 🔧 Customização

O sistema foi desenvolvido para ser facilmente customizável através do arquivo `lib/crm-config.ts`, onde você pode:

- Adicionar novos produtos
- Modificar status de leads
- Alterar templates de mensagem
- Configurar cores do tema
- Definir fontes de leads

## 📱 Responsividade

O sistema é totalmente responsivo, adaptando-se a:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🔒 Segurança

- Validação de dados com Zod
- Sanitização de inputs
- Headers de segurança
- Rate limiting na API

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é proprietário da Dimarzio Seguros.

## 📞 Suporte

Para suporte técnico, entre em contato através dos canais oficiais da Dimarzio Seguros.

---

Desenvolvido com ❤️ para a Dimarzio Seguros
