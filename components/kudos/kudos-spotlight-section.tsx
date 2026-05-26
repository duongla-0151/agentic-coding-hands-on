"use client";

import { useState, useEffect } from "react";
import { SpotlightBoard } from "./spotlight-board";

interface SpotlightData {
  total: number;
  recipients: { id: string; name: string; kudos_count: number }[];
}

export function KudosSpotlightSection() {
  const [data, setData] = useState<SpotlightData>({ total: 0, recipients: [] });

  useEffect(() => {
    fetch("/api/kudos/spotlight")
      .then((r) => r.json())
      .then((d: SpotlightData) => setData(d))
      .catch(() => {/* silent */});
  }, []);

  return <SpotlightBoard total={data.total} recipients={data.recipients} />;
}
