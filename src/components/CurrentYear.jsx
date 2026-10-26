"use client";

import { useEffect, useState } from "react";

export default function CurrentYear({ initial }) {
  const [year, setYear] = useState(initial);

  useEffect(function () {
    setYear(new Date().getFullYear());
  }, []);

  return <>{year}</>;
}
