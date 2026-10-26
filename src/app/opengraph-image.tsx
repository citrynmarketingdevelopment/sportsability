import { ImageResponse } from "next/og";
import { tagline } from "@/lib/content";
export const alt = `SportAbility. ${tagline}. Adaptive soccer in Bakersfield.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", background: "#edf6fd", padding: 80, fontFamily: "sans-serif", color: "#14334c" }}><div style={{display:"flex",fontSize:30,color:"#0453b1",marginBottom:24,fontWeight:700}}>SportAbility</div><div style={{display:"flex",fontSize:85,fontWeight:800,letterSpacing:-4}}>Every Athlete.</div><div style={{display:"flex",fontSize:72,fontWeight:800,letterSpacing:-3,color:"#0453b1"}}>Empowered Through Sports</div><div style={{display:"flex",height:6,width:490,background:"#4da431",marginTop:12,marginBottom:32}}/><div style={{display:"flex",fontSize:27}}>Adaptive soccer in Bakersfield, California.</div></div>, size);
}
