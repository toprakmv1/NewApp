export const colors = {
  background: { primary: '#050A0B', secondary: '#071214', tertiary: '#09191A' },
  surface: { primary: '#0D2829', secondary: '#123637', elevated: '#1B4E4D' },
  accent: { cyan: '#00E5D4', aqua: '#18F0DF', emerald: '#00BFB3' },
  text: { primary: '#F5FFFF', secondary: '#A7C7C6' },
} as const;

export const spacing = { xs:4, sm:8, md:12, lg:16, xl:24, xxl:32, xxxl:48 } as const;
export const radius = { sm:10, md:16, lg:24, xl:32, pill:999 } as const;
export const typography = { title:34, section:20, body:16, caption:12 } as const;
export const motion = { fast:160, normal:280, slow:600, cinematic:1000 } as const;
