import { ImageResponse } from "next/og";

import { profile } from "@/lib/site-data";

export const alt = `${profile.name} bag collection preview`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "radial-gradient(circle at top, rgba(215,190,142,0.16), transparent 28%), linear-gradient(180deg, rgba(29,20,16,1) 0%, rgba(39,27,21,1) 46%, rgba(21,15,11,1) 100%)",
          color: "#f7f0e9",
          fontFamily: "serif",
          padding: "60px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(215,190,142,0.08), rgba(133,117,96,0.06) 40%, rgba(16,12,9,0.98) 72%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid rgba(255,247,238,0.12)",
            borderRadius: 36,
            background: "rgba(23,17,13,0.62)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.24)",
            padding: 48,
            width: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 34%)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 18, position: "relative" }}>
            <span
              style={{
                fontSize: 20,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(215,190,142,0.88)",
              }}
            >
              {profile.name}
            </span>
            <h1
              style={{
                margin: 0,
                fontSize: 90,
                lineHeight: 0.9,
                maxWidth: 760,
                fontWeight: 600,
              }}
            >
              A calmer edit of branded bags in Yangon.
            </h1>
            <p
              style={{
                margin: 0,
                maxWidth: 760,
                fontSize: 29,
                lineHeight: 1.4,
                color: "rgba(247,240,233,0.76)",
              }}
            >
              David Jones and Mossdoom styles with direct ordering and a cleaner storefront.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "center",
              fontSize: 22,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(215,190,142,0.88)",
              position: "relative",
            }}
          >
            <span>Carryalls</span>
            <span>Shoulders</span>
            <span>Minis</span>
            <span>Totes</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
