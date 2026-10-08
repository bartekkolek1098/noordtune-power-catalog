import {ChevronRight} from "lucide-react";

type SeoInfoCard={title:string;text:string};
type SeoInfoLink={href:string;label:string;primary?:boolean};

export function SeoInfoSections({
  cards,eyebrow,links,title
}:{
  cards:SeoInfoCard[];
  eyebrow:string;
  links:SeoInfoLink[];
  title:string;
}){
 return (
  <section className="ux-profile-info mt-12 min-w-0" aria-label={title}>
   <div className="ux-profile-info__header">
    <p className="ux-eyebrow">{eyebrow}</p>
    <h2 className="ux-content-heading mt-4">{title}</h2>
   </div>
   <div className="ux-profile-info__grid">
    {cards.map((card,index)=>(
     <article className="ux-profile-info__card" key={card.title}>
      <span aria-hidden="true">{String(index+1).padStart(2,"0")}</span>
      <h3>{card.title}</h3>
      <p>{card.text}</p>
     </article>
    ))}
   </div>
   <nav aria-label={title} className="ux-profile-info__links">
    {links.map(link=>(
      <a
       className={link.primary?"ux-profile-info__link ux-profile-info__link--primary":"ux-profile-info__link"}
       href={link.href}
       key={link.href}
      >{link.label}<ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true"/></a>
    ))}
   </nav>
  </section>
 );
}
