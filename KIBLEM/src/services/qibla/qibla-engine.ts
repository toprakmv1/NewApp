const KAABA_LAT = 21.422487;
const KAABA_LON = 39.826206;

export function getQiblaBearing(latitude: number, longitude: number): number {
  validate(latitude, longitude);
  const φ1 = toRad(latitude);
  const φ2 = toRad(KAABA_LAT);
  const Δλ = toRad(KAABA_LON - longitude);
  const y = Math.sin(Δλ);
  const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export function angleDifference(a: number, b: number): number {
  const d = Math.abs(((a - b + 540) % 360) - 180);
  return d;
}
const toRad=(d:number)=>d*Math.PI/180;
const toDeg=(r:number)=>r*180/Math.PI;
function validate(lat:number,lon:number){if(!Number.isFinite(lat)||lat<-90||lat>90)throw new Error('Invalid latitude');if(!Number.isFinite(lon)||lon<-180||lon>180)throw new Error('Invalid longitude');}
