/* eslint-disable react-hooks/set-state-in-effect -- Capability is measured against the browser WebGL API after hydration. */
"use client";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Link, { useLinkStatus } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { currentSection, sections, labels } from "@/lib/navigation";
import type { Section } from "@/lib/content/types";
import CapabilityBoundary from "./CapabilityBoundary";
const Scene = dynamic(() => import("./CockpitScene"), { ssr: false });
function subscribeViewport(callback: () => void) {
  const query = matchMedia("(min-width: 1024px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function subscribeMotion(callback: () => void) {
  const query = matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function Pending() {
  const { pending } = useLinkStatus();
  return pending ? <span role="status"> / Tuning in...</span> : null;
}
export default function CockpitShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const desktop = useSyncExternalStore(
    subscribeViewport,
    () => matchMedia("(min-width: 1024px)").matches,
    () => false,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const [capable, setCapable] = useState(false),
    [failed, setFailed] = useState(false),
    [ready, setReady] = useState(false);
  const pathname = usePathname(),
    section = currentSection(pathname),
    router = useRouter();
  useEffect(() => {
    if (!desktop) return;
    let supported = false;
    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl2");
      supported = !!context;
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      /* The terminal remains usable when a graphics context cannot be created. */
    }
    setCapable(supported);
  }, [desktop]);
  const onFailure = useCallback(() => {
    setFailed(true);
    setReady(false);
  }, []);
  const onReady = useCallback(() => setReady(true), []);
  const onNavigate = useCallback(
    (s: Section) => router.push("/" + s),
    [router],
  );
  const show = desktop && capable && !failed;
  return (
    <div className={"cockpit-shell" + (show && ready ? " room-active" : "")}>
      <div
        className="cockpit-stage"
        data-scene-ready={show && ready ? "true" : undefined}
      >
        {show && (
          <div className="room-layer" aria-hidden="true">
            <CapabilityBoundary onFailure={onFailure}>
              <Scene
                section={section}
                onNavigate={onNavigate}
                reducedMotion={reducedMotion}
                onFailure={onFailure}
                onReady={onReady}
              />
            </CapabilityBoundary>
          </div>
        )}
        <div className="semantic-layer">{children}</div>
      </div>
      <nav aria-label="Directory">
        {sections.map((s, i) => (
          <Link
            key={s}
            href={"/" + s}
            aria-current={
              pathname !== "/" && section === s ? "page" : undefined
            }
          >
            {String(i + 1).padStart(2, "0")} / {labels[s]}
            <Pending />
          </Link>
        ))}
      </nav>
    </div>
  );
}
