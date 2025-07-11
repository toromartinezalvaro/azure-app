# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Development

Run the dev server:

```sh
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.

# Azure App Client

Frontend de la aplicación de gastos personales usando Remix.

## Deployment
- Dockerized application
- Deployed to Azure App Service
- Connected to .NET backend

## Debug: Force rebuild with new logs

#  D o c k e r   d e p l o y m e n t   t e s t 
 
#  D o c k e r   c r e d e n t i a l s   f i x e d 
 
#  F i x   f r o n t e n d - b a c k e n d   c o n n e c t i o n 
 
#  F i n a l   f i x :   D o c k e r f i l e   a n d   d o c k e r - c o m p o s e   c o r r e c t i o n s 
 
#  R e m o v e   . e n v   f i l e s   t h a t   w e r e   o v e r r i d i n g   V I T E _ A P I _ U R L 
 
#  F i x   f a l l b a c k   U R L   t o   u s e   A z u r e   b a c k e n d   d i r e c t l y 
 
#  T e s t   w i t h   c o r r e c t e d   V I T E _ A P I _ U R L   s e c r e t 
 
 