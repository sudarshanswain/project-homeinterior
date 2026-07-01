"use client";

import { useState, useEffect } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function usePublicData<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setData(result.data);
        } else {
          throw new Error(result.error || "Failed to fetch data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

type DataStates = {
  [K in string]: { data: unknown; loading: boolean; error: string | null };
};

export function useMultiplePublicData(urls: Record<string, string>): DataStates {
  const [states, setStates] = useState<DataStates>(() => {
    const initial: DataStates = {};
    for (const key in urls) {
      initial[key] = { data: null, loading: true, error: null };
    }
    return initial;
  });

  useEffect(() => {
    const fetchAll = async () => {
      const newStates: DataStates = { ...states };

      for (const key in urls) {
        try {
          newStates[key] = { ...newStates[key], loading: true, error: null };

          const response = await fetch(urls[key]);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();

          if (result.success && result.data) {
            newStates[key] = { data: result.data, loading: false, error: null };
          } else {
            throw new Error(result.error || "Failed to fetch data");
          }
        } catch (err) {
          newStates[key] = {
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : "An error occurred",
          };
        }
      }

      setStates(newStates);
    };

    fetchAll();
  }, [JSON.stringify(urls)]);

  return states;
}