// ─── Meta Pixel ──────────────────────────────────────────────────────────────
// Pixel de Meta (Facebook/Instagram Ads) para AR Building.
// Snippet oficial provisto por el cliente. Se inyecta en <head> para que dispare
// lo antes posible. El mismo PIXEL_ID se usa en los sitios de AMBROSONI y MORENO
// (una sola cuenta de Meta trackea ambos proyectos).
//
// Verificar con la extensión "Meta Pixel Helper" (Chrome) o revisando la request
// a connect.facebook.net/.../fbevents.js + el hit a facebook.com/tr en la pestaña
// Network con el filtro "tr?id=".

const PIXEL_ID = "1538582751047565"

export function MetaPixel() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}
