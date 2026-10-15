/**
 * Lightweight, browser-safe pure filtering helpers for the Dutch reviewed
 * motor finder. Do not import the verified RDW registry or tuning datasets here.
 */
export type NlReviewedMotorScope={
 from:number;to:number;registeredKw:number;cc:number;rdwType:string;
};
export type NlReviewedMotorResult={
 id:string;href:string;title:string;make:string;model:string;
 kind:"personenauto"|"bedrijfswagen";fuel:"Petrol"|"Diesel"|"CNG";
 scopes:readonly NlReviewedMotorScope[];
};
export type NlReviewedMotorFilter={
 query?:string;make?:string;kind?:"alle"|"personenauto"|"bedrijfswagen";
 fuel?:"alle"|"Petrol"|"Diesel"|"CNG";year?:number|null;registeredKw?:number|null;
};
export function normalizeMotorSearch(value:string){
 return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("nl")
  .replace(/[^a-z0-9]+/g," ").trim();
}
export function filterReviewedMotors(
 items:readonly NlReviewedMotorResult[],filter:NlReviewedMotorFilter
):NlReviewedMotorResult[]{
 const query=normalizeMotorSearch(filter.query??"").replace(/\bvw\b/g,"volkswagen");
 const tokens=query?query.split(/\s+/).filter(Boolean):[];
 return items.filter(item=>{
  if(filter.kind&&filter.kind!=="alle"&&item.kind!==filter.kind)return false;
  if(filter.make&&filter.make!==item.make)return false;
  if(filter.fuel&&filter.fuel!=="alle"&&item.fuel!==filter.fuel)return false;
  const fuelText=item.fuel==="Diesel"?"diesel tdi dci cdi hdi":item.fuel==="CNG"?"aardgas cng":"benzine petrol tsi";
  const text=normalizeMotorSearch([item.title,item.make,item.model,
   item.kind==="bedrijfswagen"?"bestelwagen bus van":"personenauto auto",fuelText].join(" "));
  if(tokens.some(token=>!text.includes(token)))return false;
  if(filter.year!==undefined&&filter.year!==null){
   if(!Number.isInteger(filter.year)||filter.year<1886||filter.year>2100)return false;
  }
  if(filter.registeredKw!==undefined&&filter.registeredKw!==null){
   if(!Number.isFinite(filter.registeredKw)||filter.registeredKw<=0)return false;
  }
  return item.scopes.some(s=>
   (filter.year===undefined||filter.year===null||(s.from<=filter.year&&filter.year<=s.to))&&
   (filter.registeredKw===undefined||filter.registeredKw===null||Math.abs(s.registeredKw-filter.registeredKw)<0.0001)
  );
 });
}
export function reviewedMotorYears(items:readonly NlReviewedMotorResult[]):readonly number[]{
 const years=new Set<number>();
 for(const item of items)for(const scope of item.scopes)
  for(let year=scope.from;year<=scope.to;year++)years.add(year);
 return [...years].sort((a,b)=>b-a);
}
