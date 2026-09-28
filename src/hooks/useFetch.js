import { useState, useEffect, useCallback, useRef } from "react";
import axiosClient from "../api/axios";

// GET helper with loading/error state. `fallback` is only used as the initial
// data (so lists render empty instead of null); it never replaces an error —
// `error` is always set when the request fails.
const useFetch = (url, { enabled = true, fallback = null } = {}) => {
  const fallbackRef = useRef(fallback);
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(Boolean(url && enabled));
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url || !enabled) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get(url);
      setData(res.data);
    } catch (err) {
      setError(err.displayMessage || "Failed to load");
      setData(fallbackRef.current);
    } finally {
      setLoading(false);
    }
  }, [url, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
