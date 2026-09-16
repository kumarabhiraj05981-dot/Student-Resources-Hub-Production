import { useMemo } from "react";

interface ResourceFiltersProps {
  search: string;
  branch: string;
  semester: string;
  category: string;
  onSearchChange: (value: string) => void;
  onBranchChange: (value: string) => void;
  onSemesterChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClear: () => void;
}

const branches = [
  "All Branches",
  "CSE",
  "IT",
  "ECE",
  "EEE",
  "ME",
  "CE",
];

const semesters = [
  "All Semesters",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
];

const categories = [
  "All Categories",
  "Notes",
  "PYQ",
  "Syllabus",
  "Ebooks",
];

export default function ResourceFilters({
  search,
  branch,
  semester,
  category,
  onSearchChange,
  onBranchChange,
  onSemesterChange,
  onCategoryChange,
  onClear,
}: ResourceFiltersProps) {
  const hasFilters = useMemo(() => {
    return (
      search.trim() !== "" ||
      branch !== "All Branches" ||
      semester !== "All Semesters" ||
      category !== "All Categories"
    );
  }, [search, branch, semester, category]);

  return (
    <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Search */}
        <div className="lg:col-span-1">
          <label
            htmlFor="resource-search"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            🔎 Search Resources
          </label>

          <input
            id="resource-search"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title or subject..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Branch */}
        <div>
          <label
            htmlFor="branch-filter"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            📚 Branch
          </label>

          <select
            id="branch-filter"
            value={branch}
            onChange={(e) => onBranchChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {branches.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Semester */}
        <div>
          <label
            htmlFor="semester-filter"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            🎓 Semester
          </label>

          <select
            id="semester-filter"
            value={semester}
            onChange={(e) => onSemesterChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {semesters.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category-filter"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            📂 Category
          </label>

          <select
            id="category-filter"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasFilters && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClear}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 sm:w-auto"
          >
            ✕ Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}