import { useState } from "react";
import api from "../../services/api";

interface BookmarkButtonProps {
  resourceId: string;
  bookmarked: boolean;
  onChange: (
    resourceId: string,
    bookmarked: boolean
  ) => void;
}

export default function BookmarkButton({
  resourceId,
  bookmarked,
  onChange,
}: BookmarkButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleBookmark = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      setLoading(true);

      if (bookmarked) {
        await api.delete(`/api/bookmarks/${resourceId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        onChange(resourceId, false);
      } else {
        await api.post(
          `/api/bookmarks/${resourceId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        onChange(resourceId, true);
      }
    } catch (error: any) {
      console.error("BOOKMARK ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Bookmark operation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBookmark}
      disabled={loading}
      className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-yellow-400 bg-yellow-50 px-4 py-3 text-sm font-bold text-yellow-700 hover:bg-yellow-100 disabled:opacity-50"
    >
      <span className="text-xl">
        {bookmarked ? "★" : "☆"}
      </span>

      <span>
        {loading
          ? "Saving..."
          : bookmarked
          ? "Saved"
          : "Bookmark"}
      </span>
    </button>
  );
}